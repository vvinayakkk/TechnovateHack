import {Event} from '../../models/index.js';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    },
});

// HTML template for e-ticket
const generateETicketHTML = (event, ticketNumber, qrCodeData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${event.title} - E-Ticket</title>
        <style>
            @keyframes shine {
                0% { background-position: -100px; }
                100% { background-position: 500px; }
            }
  
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                background-color: #f5f5f5;
                background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCA1TDUgMzBsMjUgMjUgMjUtMjVMzMAgNXptMCA3LjVMMzUgMTdsLTUgNS01LTUtNSA1IDUgNSA1LTUgNSA1LTUgNSA1IDUgNS01LTUtNSA1LTUtNSA1eiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPgo8L3N2Zz4=');
                background-repeat: repeat;
            }
  
            .ticket-container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 4px 25px rgba(0,0,0,0.1);
                overflow: hidden;
                position: relative;
            }
  
            .ticket-header {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+CiAgPHBhdGggZD0iTTAgMGgxNTB2MTUwSDB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTc1IDI1TDI1IDc1bDUwIDUwIDUwLTUwTDc1IDI1eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+Cjwvc3ZnPg==');
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
  
            .ticket-header::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100px;
                width: 50px;
                height: 100%;
                background: rgba(255,255,255,0.2);
                transform: skewX(-25deg);
                animation: shine 3s infinite;
            }
  
            .ticket-header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
  
            .ticket-header p {
                margin: 10px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
  
            .ticket-body {
                padding: 30px;
                background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz4KPC9zdmc+');
            }
  
            .ticket-info {
                margin-bottom: 25px;
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
  
            .ticket-info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px dashed #e5e7eb;
                position: relative;
            }
  
            .ticket-info-row:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
  
            .ticket-label {
                color: #6b7280;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
            }
  
            .ticket-value {
                color: #111827;
                font-size: 16px;
                font-weight: 600;
                text-align: right;
            }
  
            .qr-section {
                text-align: center;
                padding: 30px;
                background-color: #f9fafb;
                border-radius: 12px;
                position: relative;
                margin-top: 30px;
            }
  
            .qr-section::before {
                content: '';
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 20px;
                background: white;
                border-radius: 0 0 30px 30px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
  
            .qr-code {
                width: 200px;
                height: 200px;
                margin: 10px auto;
                padding: 10px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            }
  
            .ticket-number {
                font-family: monospace;
                font-size: 16px;
                color: #4f46e5;
                background-color: #eef2ff;
                padding: 12px 20px;
                border-radius: 8px;
                display: inline-block;
                margin-top: 15px;
                box-shadow: 0 2px 4px rgba(79,70,229,0.1);
                border: 1px solid rgba(79,70,229,0.2);
            }
  
            .footer {
                text-align: center;
                padding: 25px;
                color: #6b7280;
                font-size: 13px;
                background-color: #f9fafb;
                border-top: 1px dashed #e5e7eb;
            }
  
            .important-note {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 12px 12px 0;
                position: relative;
                box-shadow: 0 2px 8px rgba(245,158,11,0.1);
            }
  
            .important-note::before {
                content: '!';
                position: absolute;
                left: -12px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                background: #f59e0b;
                border-radius: 50%;
                color: white;
                font-weight: bold;
                text-align: center;
                line-height: 20px;
                font-size: 14px;
            }
  
            @media print {
                body {
                    background: none;
                    padding: 0;
                }
                .ticket-container {
                    box-shadow: none;
                    margin: 0;
                }
            }
  
            @media (max-width: 480px) {
                body {
                    padding: 10px;
                }
                .ticket-header {
                    padding: 30px 20px;
                }
                .ticket-body {
                    padding: 20px;
                }
                .ticket-info-row {
                    flex-direction: column;
                    text-align: left;
                }
                .ticket-value {
                    text-align: left;
                    margin-top: 5px;
                }
            }
        </style>
    </head>
    <body>
        <div class="ticket-container">
            <div class="ticket-header">
                <h1>${event.title}</h1>
                <p>E-Ticket</p>
            </div>
            
            <div class="ticket-body">
                <div class="ticket-info">
                    <div class="ticket-info-row">
                        <span class="ticket-label">📅 Date</span>
                        <span class="ticket-value">${new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <div class="ticket-info-row">
                        <span class="ticket-label">⏰ Time</span>
                        <span class="ticket-value">${event.time}</span>
                    </div>
                    <div class="ticket-info-row">
                        <span class="ticket-label">📍 Location</span>
                        <span class="ticket-value">${event.location.address}<br>${event.location.city}</span>
                    </div>
                    <div class="ticket-info-row">
                        <span class="ticket-label">🏷️ Category</span>
                        <span class="ticket-value">${event.category}</span>
                    </div>
                </div>
  
                <div class="important-note">
                    <strong>Important:</strong> Please present this ticket (either printed or on your mobile device) at the entrance. Make sure the QR code is clearly visible.
                </div>
  
                <div class="qr-section">
                    <h3 style="margin: 0 0 15px 0; color: #374151;">Your Ticket QR Code</h3>
                    <img src="${qrCodeData}" alt="Event QR Code" class="qr-code"/>
                    <div class="ticket-number">${ticketNumber}</div>
                </div>
            </div>
  
            <div class="footer">
                <p style="margin: 0 0 5px 0;">This ticket is valid for one person only and cannot be resold.</p>
                <p style="margin: 0;">For questions or support, please contact the event organizer.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

// Create new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      hostUserID,
      category,
      maxAttendees,
      price,
      isPublic
    } = req.body;

    const eventID = 'EVT_' + uuidv4().substring(0, 8);

    const newEvent = new Event({
      eventID,
      title,
      description,
      date,
      time,
      location,
      hostUserID,
      category,
      maxAttendees,
      price,
      isPublic,
      registeredAttendees: []
    });

    await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { eventID, userID, email } = req.body;

    const event = await Event.findOne({ eventID });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is full
    if (event.registeredAttendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is already full' });
    }

    // Check if user is already registered
    if (event.registeredAttendees.some(attendee => attendee.userID === userID)) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    // Generate unique ticket number
    const ticketNumber = 'TKT_' + uuidv4().substring(0, 12);

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(JSON.stringify({
      eventID,
      userID,
      ticketNumber
    }));

    // Add user to registered attendees
    event.registeredAttendees.push({
      userID,
      ticketNumber,
      email,
      checkedIn: false
    });

    await event.save();

    // Generate e-ticket HTML using the template
    const eTicketHTML = generateETicketHTML(event, ticketNumber, qrCodeData);

    // Send e-ticket email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your E-Ticket for ${event.title}`,
      html: eTicketHTML,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeData.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    });

    res.status(200).json({
      message: 'Registration successful. E-ticket has been sent to your email.',
      ticketNumber
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to register for event',
      error: error.message
    });
  }
};


const getEvents = async (req, res) => {
  try {
    
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving events',
      error: error.message
    });
  }
};



export {
  createEvent,
  registerForEvent,
  getEvents,
};