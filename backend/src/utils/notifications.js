const nodemailer = require('nodemailer');
const transport = require('../config/email');

/**
 * Sends a booking confirmation email.
 * @param {object} booking - The booking object.
 * @param {object} user - The user object (traveler).
 * @param {object} property - The property object.
 */
exports.sendBookingConfirmation = async (booking, user, property) => {
  try {
    const message = {
      from: '"Homestead Management" <noreply@homestead.com>',
      to: user.email,
      subject: 'Your Booking Confirmation',
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Dear ${user.name},</p>
        <p>Your booking for <strong>${property.name}</strong> has been successfully created.</p>
        <h2>Details:</h2>
        <ul>
          <li><strong>Check-in:</strong> ${new Date(booking.startDate).toLocaleDateString()}</li>
          <li><strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString()}</li>
          <li><strong>Total Price:</strong> $${booking.totalPrice}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `,
    };

    const info = await transport.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error sending email:', error);
    // In a production environment, you would want to handle this error more gracefully
  }
};
