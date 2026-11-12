interface LifecycleEvent {
  result: {
    name: string;
    email: string;
    organization?: string | null;
    interestArea: string;
    message: string;
  };
}

interface StrapiLifecycleContext {
  documents: (uid: string) => {
    findFirst: () => Promise<{ RoutingEmail?: string } | null>;
  };
  plugins: {
    email: {
      services: {
        email: {
          send: (opts: Record<string, unknown>) => Promise<unknown>;
        };
      };
    };
  };
  log: {
    warn: (msg: string) => void;
  };
}

declare const strapi: StrapiLifecycleContext;

export default {
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;

    const contactPage = await strapi
      .documents('api::contact-page.contact-page')
      .findFirst();

    const routingEmail = contactPage?.RoutingEmail;
    if (!routingEmail) {
      strapi.log.warn(
        'collaborative-interest-submission created but no RoutingEmail set on contact-page; skipping email',
      );
      return;
    }

    const orgLine = result.organization
      ? `Organization: ${result.organization}\n`
      : '';

    await strapi.plugins.email.services.email.send({
      to: routingEmail,
      replyTo: result.email,
      subject: `New collaborative interest submission from ${result.name}`,
      text: `Name: ${result.name}\nEmail: ${result.email}\n${orgLine}Interest Area: ${result.interestArea}\n\n${result.message}`,
    });
  },
};
