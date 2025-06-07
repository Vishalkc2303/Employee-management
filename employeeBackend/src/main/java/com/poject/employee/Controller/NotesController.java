package com.poject.employee.Controller;


import com.poject.employee.DTO.NotesRequestDto;
import com.poject.employee.DTO.NotesResponseDto;
import com.poject.employee.Entity.Notes;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.UserRepository;
import com.poject.employee.Service.NotesService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NotesController {

    private final NotesService notesService;
    private final UserRepository userRepository;


    @GetMapping
    public List<NotesResponseDto> getNotes(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        List<Notes> notes = notesService.getAllNotesByUser(userId);

        // Convert Notes entities to NotesResponseDto
        return notes.stream()
                .map(note -> {
                    NotesResponseDto dto = new NotesResponseDto();
                    dto.setId(note.getId());
                    dto.setDescription(note.getDescription());
                    dto.setUserId(note.getUser().getId());  // Get user ID
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /*@GetMapping("/recent")
    public List<Notes> getRecentNotes() {
        return notesService.getRecentNotes();
    }*/
    @GetMapping("/recent")
    public List<NotesResponseDto> getRecentNotes(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        return notesService.getRecentNotesByUser(userId);
    }



    /*@GetMapping
    public List<Notes> getNotes(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        return notesService.getAllNotesByUser(userId);
    }*/

    @PostMapping
    public Notes addNote(@RequestBody NotesRequestDto notesRequestDto, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notes note = new Notes();
        note.setDescription(notesRequestDto.getDescription());
        note.setUser(user);

        return notesService.saveNote(note);
    }



   /* @PutMapping("/{id}")
    public Notes updateNote(@PathVariable Long id, @RequestBody NotesRequestDto notesRequestDto) {
        return notesService.updateNote(id, notesRequestDto.getDescription());
    }*/

    @PutMapping("/{id}")
    public ResponseEntity<NotesResponseDto> updateNote(@PathVariable Long id, @RequestBody NotesRequestDto notesRequestDto) {
        // Call the service to update the note
        NotesResponseDto updatedNote = notesService.updateNote(id, notesRequestDto.getDescription());

        // Return the updated note wrapped in a ResponseEntity
        return ResponseEntity.ok(updatedNote);
    }


    /*@PutMapping("/{id}")
    public ResponseEntity<Notes> updateNote(
            @PathVariable Long id,
            @RequestBody NotesRequestDto notesRequestDto) {

        // Fetch the existing note from the database
        Notes existingNote = notesService.getNoteById(id);

        // Check if the note exists, if not return 404 Not Found
        if (existingNote == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Update the description of the note
        existingNote.setDescription(notesRequestDto.getDescription());

        // Save the updated note
        Notes updatedNote = notesService.saveNote(existingNote);

        // Return the updated note in the response
        return ResponseEntity.ok(updatedNote);
    }*/



    /*@PutMapping("/{id}")
    public Notes updateNote(@PathVariable Long id, @RequestBody Notes updatedNote) {
        return notesService.updateNote(id, updatedNote.getDescription());
    }*/

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        notesService.deleteNoteById(id);
    }
}
