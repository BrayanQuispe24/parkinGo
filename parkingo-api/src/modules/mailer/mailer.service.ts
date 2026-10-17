// src/modules/mailer/mailer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);
    private readonly resendClient: Resend | null = null;
    private readonly nodemailerTransporter: Transporter | null = null;
    private readonly mailFrom: string;

    constructor(private readonly configService: ConfigService) {
        // 1. Configuración de SMTP (Gmail, Outlook, Hostinger, etc.)
        const smtpUser = this.configService.get<string>('SMTP_USER');
        const smtpPass = this.configService.get<string>('SMTP_PASS');
        const smtpHost = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
        const smtpPort = Number(this.configService.get<string>('SMTP_PORT')) || 465;
        const smtpSecure = smtpPort === 465;

        // 2. Configuración de Resend
        const resendApiKey = this.configService.get<string>('RESEND_API_KEY');

        if (smtpUser && smtpPass) {
            this.nodemailerTransporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpSecure, // true para 465, false para 587
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
            this.mailFrom = this.configService.get<string>('PARKINGO_MAIL_FROM') || `"ParkinGo" <${smtpUser}>`;
            this.logger.log(`Mailer inicializado vía SMTP (${smtpHost}) con cuenta: ${smtpUser}`);
        } else if (resendApiKey) {
            this.resendClient = new Resend(resendApiKey);
            this.mailFrom = this.configService.get<string>('PARKINGO_MAIL_FROM') || 'ParkinGo <onboarding@resend.dev>';
            this.logger.log('Mailer inicializado vía Resend API.');
        } else {
            this.mailFrom = 'ParkinGo <noreply@parkingo.app>';
            this.logger.warn(
                'No se configuró SMTP_USER/PASS ni RESEND_API_KEY. Los códigos OTP se imprimirán en consola para desarrollo.',
            );
        }
    }

    async sendOtpVerificationEmail(to: string, name: string, otpCode: string): Promise<boolean> {
        const subject = `${otpCode} es tu código de verificación de ParkinGo`;
        const html = this.buildOtpEmailTemplate(name, otpCode);

        // Registro visual en consola para depuración ágil
        this.logger.log(`====================================================`);
        this.logger.log(`📧 [CÓDIGO OTP] Para: ${to} | Código: [ ${otpCode} ]`);
        this.logger.log(`====================================================`);

        // Caso A: Envío vía SMTP (Gmail o servidor de correo propio)
        if (this.nodemailerTransporter) {
            try {
                await this.nodemailerTransporter.sendMail({
                    from: this.mailFrom,
                    to,
                    subject,
                    html,
                });
                this.logger.log(`Correo enviado exitosamente vía SMTP a ${to}`);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                this.logger.error(`Error al enviar correo vía SMTP a ${to}: ${message}`);
                return false;
            }
        }

        // Caso B: Envío vía Resend API
        if (this.resendClient) {
            try {
                const { error } = await this.resendClient.emails.send({
                    from: this.mailFrom,
                    to: [to],
                    subject,
                    html,
                });

                if (error) {
                    this.logger.error(`Error al enviar correo vía Resend a ${to}: ${error.message}`);
                    return false;
                }

                this.logger.log(`Correo enviado exitosamente vía Resend a ${to}`);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                this.logger.error(`Excepción en despacho Resend a ${to}: ${message}`);
                return false;
            }
        }

        // Caso C: Fallback a consola de desarrollo
        return true;
    }

    private buildOtpEmailTemplate(name: string, otp: string): string {
        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificación de Correo - ParkinGo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F7F8F4; color: #1E293B;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2.5rem 1rem;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
                  <!-- Encabezado con marca -->
                  <tr>
                    <td style="background-color: #063D25; padding: 1.75rem 2rem; text-align: center;">
                      <h1 style="margin: 0; font-size: 1.5rem; color: #FFFFFF; letter-spacing: -0.5px; font-weight: 800;">
                        Parkin<span style="color: #22C55E;">Go</span>
                      </h1>
                      <p style="margin: 0.35rem 0 0 0; font-size: 0.8rem; color: #A7F3D0;">
                        Sistema de Estacionamiento Inteligente
                      </p>
                    </td>
                  </tr>

                  <!-- Contenido principal -->
                  <tr>
                    <td style="padding: 2rem 2.25rem;">
                      <h2 style="margin: 0 0 0.75rem 0; font-size: 1.2rem; color: #0F2417; font-weight: 700;">
                        ¡Hola, ${name || 'Usuario'}!
                      </h2>
                      <p style="margin: 0 0 1.25rem 0; font-size: 0.92rem; color: #475569; line-height: 1.5;">
                        Gracias por registrarte en ParkinGo. Para verificar tu dirección de correo electrónico y proteger tu cuenta, ingresa el siguiente código de confirmación:
                      </p>

                      <!-- Bloque Código OTP -->
                      <div style="background-color: #F0FDF4; border: 1.5px dashed #22C55E; border-radius: 8px; padding: 1.25rem; text-align: center; margin: 1.5rem 0;">
                        <span style="font-size: 2.25rem; font-weight: 800; letter-spacing: 6px; color: #006D36; display: inline-block;">
                          ${otp}
                        </span>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #15803D; font-weight: 600;">
                          ⏱️ Este código expira en 15 minutos
                        </p>
                      </div>

                      <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: #64748B; line-height: 1.45;">
                        Si tú no solicitaste este código, puedes ignorar este mensaje de manera segura. Nadie puede acceder a tu cuenta sin él.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 1.25rem; text-align: center; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #94A3B8;">
                      © ${new Date().getFullYear()} ParkinGo Bolivia. Todos los derechos reservados.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;
    }

    async sendOperatorWelcomeEmail(
        to: string,
        name: string,
        tempPassword: string,
        loginUrl: string = 'http://localhost:5173/auth?mode=login'
    ): Promise<boolean> {
        const subject = `¡Bienvenido a ParkinGo! Credenciales de Operador de Garita`;
        const html = this.buildOperatorWelcomeEmailTemplate(name, tempPassword, loginUrl);

        // Registro visual en consola para depuración ágil
        this.logger.log(`====================================================`);
        this.logger.log(`📧 [BIENVENIDA OPERADOR] Para: ${to} | Clave Temporal: [ ${tempPassword} ]`);
        this.logger.log(`====================================================`);

        // Caso A: Envío vía SMTP
        if (this.nodemailerTransporter) {
            try {
                await this.nodemailerTransporter.sendMail({
                    from: this.mailFrom,
                    to,
                    subject,
                    html,
                });
                this.logger.log(`Correo de bienvenida enviado exitosamente vía SMTP a ${to}`);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                this.logger.error(`Error al enviar bienvenida vía SMTP a ${to}: ${message}`);
                return false;
            }
        }

        // Caso B: Envío vía Resend API
        if (this.resendClient) {
            try {
                const { error } = await this.resendClient.emails.send({
                    from: this.mailFrom,
                    to: [to],
                    subject,
                    html,
                });

                if (error) {
                    this.logger.error(`Error al enviar bienvenida vía Resend a ${to}: ${error.message}`);
                    return false;
                }

                this.logger.log(`Correo de bienvenida enviado exitosamente vía Resend a ${to}`);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                this.logger.error(`Excepción en bienvenida Resend a ${to}: ${message}`);
                return false;
            }
        }

        return true;
    }

    private buildOperatorWelcomeEmailTemplate(name: string, tempPassword: string, loginUrl: string): string {
        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F8F4; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2.5rem 1rem;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 540px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
                  <!-- Encabezado corporativo -->
                  <tr>
                    <td style="background-color: #063D25; padding: 1.75rem 2rem; text-align: center;">
                      <h1 style="margin: 0; font-size: 1.5rem; color: #FFFFFF; letter-spacing: -0.5px; font-weight: 800;">
                        Parkin<span style="color: #22C55E;">Go</span>
                      </h1>
                      <p style="margin: 0.35rem 0 0 0; font-size: 0.8rem; color: #A7F3D0;">
                        Portal de Administración y Control Operativo
                      </p>
                    </td>
                  </tr>

                  <!-- Contenido principal -->
                  <tr>
                    <td style="padding: 2rem 2.25rem;">
                      <h2 style="margin: 0 0 0.75rem 0; font-size: 1.25rem; color: #0F2417; font-weight: 700;">
                        ¡Bienvenido al Equipo, ${name || 'Operador'}!
                      </h2>
                      <p style="margin: 0 0 1.25rem 0; font-size: 0.92rem; color: #475569; line-height: 1.5;">
                        Tu Administrador de Parqueo te ha habilitado como <strong>Operador de Garita</strong> en la plataforma ParkinGo. Ya puedes iniciar sesión con las siguientes credenciales:
                      </p>

                      <!-- Bloque de Credenciales -->
                      <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 1.25rem; margin: 1.25rem 0;">
                        <div style="margin-bottom: 0.75rem;">
                          <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748B; font-weight: 700; display: block; letter-spacing: 0.05em;">
                            Rol Asignado
                          </span>
                          <span style="font-size: 0.95rem; font-weight: 700; color: #006D36;">
                            Operador de Caseta y Control
                          </span>
                        </div>
                        <div>
                          <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748B; font-weight: 700; display: block; letter-spacing: 0.05em;">
                            Contraseña Temporal
                          </span>
                          <span style="font-size: 1.15rem; font-family: monospace; font-weight: 800; color: #0F172A; background: #FFFFFF; padding: 0.35rem 0.65rem; border-radius: 4px; border: 1px solid #E2E8F0; display: inline-block; margin-top: 0.25rem;">
                            ${tempPassword}
                          </span>
                        </div>
                      </div>

                      <!-- Botón de Acceso -->
                      <div style="text-align: center; margin: 1.75rem 0;">
                        <a href="${loginUrl}" target="_blank" style="background-color: #006D36; color: #FFFFFF; text-decoration: none; padding: 0.75rem 1.75rem; border-radius: 6px; font-size: 0.9rem; font-weight: 700; display: inline-block; box-shadow: 0 2px 6px rgba(0, 109, 54, 0.25);">
                          Acceder al Sistema de Garita
                        </a>
                      </div>

                      <p style="margin: 0; font-size: 0.8rem; color: #64748B; line-height: 1.45; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
                        💡 <strong>Recomendación de Seguridad:</strong> Por motivos de confidencialidad, te recomendamos cambiar tu contraseña temporal desde tu perfil personal una vez que ingreses al sistema.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 1.25rem; text-align: center; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #94A3B8;">
                      © ${new Date().getFullYear()} ParkinGo Bolivia. Todos los derechos reservados.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;
    }

    async sendTenantCreatedConfirmationEmail(
        to: string,
        adminName: string,
        tenantData: {
            nombre: string;
            nit: string;
            razonSocial: string;
            estado: string;
            fecha: string;
        }
    ): Promise<boolean> {
        const subject = `Confirmación de Registro de Empresa: ${tenantData.nombre} - ParkinGo`;
        const html = this.buildTenantConfirmationEmailTemplate(adminName, tenantData);

        this.logger.log(`====================================================`);
        this.logger.log(`🏢 [REGISTRO TENANT] Para: ${to} | Empresa: ${tenantData.nombre} (NIT: ${tenantData.nit})`);
        this.logger.log(`====================================================`);

        if (this.nodemailerTransporter) {
            try {
                await this.nodemailerTransporter.sendMail({
                    from: this.mailFrom,
                    to,
                    subject,
                    html,
                });
                this.logger.log(`Correo de confirmación de Tenant enviado vía SMTP a: ${to}`);
                return true;
            } catch (error) {
                this.logger.error(`Error enviando correo SMTP a ${to}:`, error);
                return false;
            }
        } else if (this.resendClient) {
            try {
                await this.resendClient.emails.send({
                    from: this.mailFrom,
                    to,
                    subject,
                    html,
                });
                this.logger.log(`Correo de confirmación de Tenant enviado vía Resend a: ${to}`);
                return true;
            } catch (error) {
                this.logger.error(`Error enviando correo Resend a ${to}:`, error);
                return false;
            }
        }

        return true;
    }

    private buildTenantConfirmationEmailTemplate(
        adminName: string,
        tenantData: {
            nombre: string;
            nit: string;
            razonSocial: string;
            estado: string;
            fecha: string;
        }
    ): string {
        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Empresa ParkinGo</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAF9; margin: 0; padding: 24px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #063D25; padding: 2rem 2.25rem; text-align: center;">
                      <h1 style="color: #FFFFFF; margin: 0; font-size: 1.5rem; letter-spacing: 0.05em; font-weight: 800;">
                        PARKIN<span style="color: #22C55E;">GO</span>
                      </h1>
                      <p style="color: #A7F3D0; margin: 0.35rem 0 0 0; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.12em;">
                        Confirmación de Creación de Empresa / Tenant
                      </p>
                    </td>
                  </tr>

                  <!-- Contenido -->
                  <tr>
                    <td style="padding: 2rem 2.25rem;">
                      <h2 style="margin: 0 0 0.75rem 0; font-size: 1.15rem; color: #0F172A; font-weight: 700;">
                        ¡Estimado(a) ${adminName || 'Administrador'}!
                      </h2>
                      <p style="margin: 0 0 1.25rem 0; font-size: 0.9rem; color: #475569; line-height: 1.5;">
                        Le confirmamos que los datos de su empresa han sido registrados y habilitados exitosamente en la plataforma de <strong>ParkinGo Multi-Tenant</strong>.
                      </p>

                      <!-- Ficha Resumen -->
                      <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 1.25rem; margin: 1.5rem 0;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="6">
                          <tr>
                            <td width="38%" style="font-size: 0.78rem; text-transform: uppercase; color: #166534; font-weight: 700;">Nombre Comercial:</td>
                            <td style="font-size: 0.9rem; font-weight: 800; color: #064E3B;">${tenantData.nombre}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 0.78rem; text-transform: uppercase; color: #166534; font-weight: 700;">NIT:</td>
                            <td style="font-size: 0.9rem; font-weight: 700; color: #0F172A;">${tenantData.nit}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 0.78rem; text-transform: uppercase; color: #166534; font-weight: 700;">Razón Social:</td>
                            <td style="font-size: 0.9rem; color: #334155;">${tenantData.razonSocial}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 0.78rem; text-transform: uppercase; color: #166534; font-weight: 700;">Estado de Operación:</td>
                            <td>
                              <span style="background-color: #22C55E; color: #064E3B; font-weight: 800; font-size: 0.72rem; padding: 0.15rem 0.6rem; border-radius: 12px; text-transform: uppercase;">
                                ${tenantData.estado}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 0.78rem; text-transform: uppercase; color: #166534; font-weight: 700;">Fecha de Registro:</td>
                            <td style="font-size: 0.85rem; color: #64748B;">${tenantData.fecha}</td>
                          </tr>
                        </table>
                      </div>

                      <p style="margin: 0; font-size: 0.82rem; color: #64748B; line-height: 1.45; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
                        Puede gestionar sus datos, editar información o administrar sucursales vinculadas ingresando a su portal de <strong>Administración de Parqueo</strong>.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 1.25rem; text-align: center; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #94A3B8;">
                      © ${new Date().getFullYear()} ParkinGo Multi-Tenant System. Todos los derechos reservados.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;
    }
}

