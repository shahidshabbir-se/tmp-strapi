export default {
  async afterCreate(event) {
    const { result } = event;

    const contactPage = await strapi
      .documents('api::contact-page.contact-page')
      .findFirst();

    const routingEmail = contactPage?.RoutingEmail;
    if (!routingEmail) {
      strapi.log.warn(
        'contact-submission created but no RoutingEmail set on contact-page; skipping email',
      );
      return;
    }

    const lines = [
      `Name: ${result.name}`,
      `Email: ${result.email}`,
      result.inquiryArea ? `Inquiry Area: ${result.inquiryArea}` : null,
      result.organization ? `Organization: ${result.organization}` : null,
      result.phone ? `Phone: ${result.phone}` : null,
      '',
      result.message,
    ].filter((line) => line !== null);

    await strapi.plugins['email'].services.email.send({
      to: routingEmail,
      replyTo: result.email,
      subject: `New contact form submission from ${result.name}`,
      text: lines.join('\n'),
    });
  },
};
