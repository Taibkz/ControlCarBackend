import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MessageSquare, Send, Phone } from 'lucide-angular';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.css']
})
export class ContactSectionComponent {
  readonly MessageSquare = MessageSquare;
  readonly Send = Send;
  readonly Phone = Phone;

  // Estados de carga y éxito
  sending = false;
  success = false;
  error = false;

  formData = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  async sendEmail() {
    if (this.sending) return;

    this.sending = true;
    this.success = false;
    this.error = false;

    // Configuración EmailJS
    const SERVICE_ID = 'service_aeatrry'; 
    const TEMPLATE_ID = 'template_muq5npf'; 
    const PUBLIC_KEY = '3SnUOdeIfmGeuiErq'; 

    const templateParams = {
      name: this.formData.nombre,
      email: this.formData.email,
      message: this.formData.mensaje,
      time: new Date().toLocaleString()
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      this.success = true;
      this.formData = { nombre: '', email: '', mensaje: '' }; // Limpiar formulario
    } catch (err) {
      console.error('EmailJS Error:', err);
      this.error = true;
    } finally {
      this.sending = false;
      // Ocultar mensaje de éxito después de unos segundos
      setTimeout(() => this.success = false, 5000);
    }
  }

  openWhatsapp() {
    const phone = '34643181464';
    const text = 'Hola, necesito informacion sobre ControlCar';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}
