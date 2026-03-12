package com.proyecto.controlcar.service;

import com.proyecto.controlcar.model.Cita;
import com.proyecto.controlcar.model.TipoServicio;
import com.proyecto.controlcar.repository.CitaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class CitaValidationTest {

    @Mock
    private CitaRepository citaRepository;

    @InjectMocks
    private CitaService citaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldPassStrictOpeningHours_MondayMorning() {
        Cita cita = new Cita();
        cita.setFechaHora(LocalDateTime.of(2024, 6, 3, 10, 0)); // Monday 10:00 (Start)

        TipoServicio servicio = new TipoServicio();
        servicio.setDuracionMinutos(60);
        cita.setServicio(servicio); // Ends 11:00

        when(citaRepository.findByFechaHoraBetween(any(), any())).thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> citaService.save(cita));
    }

    @Test
    void shouldPassStrictOpeningHours_FridayAfternoon() {
        Cita cita = new Cita();
        cita.setFechaHora(LocalDateTime.of(2024, 6, 7, 14, 0)); // Friday 14:00

        TipoServicio servicio = new TipoServicio();
        servicio.setDuracionMinutos(60);
        cita.setServicio(servicio); // Ends 15:00 (Close time)

        // Friday 11:00 - 15:00
        when(citaRepository.findByFechaHoraBetween(any(), any())).thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> citaService.save(cita));
    }

    @Test
    void shouldFail_MondayBreakTime() {
        // Monday 14:30 - 16:00 is break
        Cita cita = new Cita();
        cita.setFechaHora(LocalDateTime.of(2024, 6, 3, 14, 0)); // Start 14:00

        TipoServicio servicio = new TipoServicio();
        servicio.setDuracionMinutos(60); // Ends 15:00 (Into break)
        cita.setServicio(servicio);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            citaService.save(cita);
        });

        assertEquals("La cita está fuera del horario de atención.", exception.getMessage());
    }

    @Test
    void shouldFail_Sunday() {
        Cita cita = new Cita();
        cita.setFechaHora(LocalDateTime.of(2024, 6, 9, 10, 0)); // Sunday

        TipoServicio servicio = new TipoServicio();
        servicio.setDuracionMinutos(60);
        cita.setServicio(servicio);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            citaService.save(cita);
        });
        assertEquals("La cita está fuera del horario de atención.", exception.getMessage());
    }

    @Test
    void shouldFail_Collision() {
        LocalDateTime now = LocalDateTime.of(2024, 6, 3, 10, 0); // Mon 10:00

        // Existing appointment: 10:00 - 11:00
        Cita existing = new Cita();
        existing.setId(1L);
        existing.setFechaHora(now);
        TipoServicio s1 = new TipoServicio();
        s1.setDuracionMinutos(60);
        existing.setServicio(s1);

        when(citaRepository.findByFechaHoraBetween(any(), any())).thenReturn(List.of(existing));

        // New appointment: 10:30 - 11:30 (Overlap)
        Cita newCita = new Cita();
        newCita.setFechaHora(now.plusMinutes(30));
        TipoServicio s2 = new TipoServicio();
        s2.setDuracionMinutos(60);
        newCita.setServicio(s2);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            citaService.save(newCita);
        });
        assertEquals("No hay disponibilidad para el horario seleccionado.", exception.getMessage());
    }

    @Test
    void shouldPass_NoCollision_AfterExisting() {
        LocalDateTime now = LocalDateTime.of(2024, 6, 3, 10, 0); // Mon 10:00

        // Existing appointment: 10:00 - 11:00
        Cita existing = new Cita();
        existing.setId(1L);
        existing.setFechaHora(now);
        TipoServicio s1 = new TipoServicio();
        s1.setDuracionMinutos(60);
        existing.setServicio(s1);

        when(citaRepository.findByFechaHoraBetween(any(), any())).thenReturn(List.of(existing));

        // New appointment: 11:00 - 12:00 (No overlap)
        Cita newCita = new Cita();
        newCita.setFechaHora(now.plusMinutes(60));
        TipoServicio s2 = new TipoServicio();
        s2.setDuracionMinutos(60);
        newCita.setServicio(s2);

        assertDoesNotThrow(() -> citaService.save(newCita));
    }
}
