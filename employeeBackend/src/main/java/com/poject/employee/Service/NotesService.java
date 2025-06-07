package com.poject.employee.Service;



import com.poject.employee.DTO.NotesResponseDto;
import com.poject.employee.Entity.Notes;
import com.poject.employee.Repo.NotesRepository;
import com.poject.employee.Repo.NotesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotesService {

    private final NotesRepository notesRepository;

    // Fetch all notes for a user (sorted by latest first)
    public List<Notes> getAllNotesByUser(Long userId) {
        return notesRepository.findAllByUserIdOrderByIdDesc(userId);
    }


    /*public List<Notes> getRecentNotes() {
        List<Notes> allNotes = notesRepository.findTop3ByOrderByIdDesc();
        return allNotes.size() > 3 ? allNotes.subList(0, 3) : allNotes;
    }*/

    public List<NotesResponseDto> getRecentNotesByUser(Long userId) {
        List<Notes> notesList = notesRepository.findTop3ByUserIdOrderByIdDesc(userId);
        return notesList.stream()
                .map(note -> new NotesResponseDto(
                        note.getId(),
                        note.getDescription(),
                        note.getUser().getId() // Fetch user id safely
                ))
                .toList();
    }


    // Save a new note
    public Notes saveNote(Notes note) {
        return notesRepository.save(note);
    }

    public NotesResponseDto updateNote(Long id, String newDescription) {
        // Fetch the note by its ID
        Notes notes = notesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        // Update the description
        notes.setDescription(newDescription);

        // Save the updated note
        notes = notesRepository.save(notes);

        // Return the updated Note as a DTO
        return new NotesResponseDto(notes.getId(), notes.getDescription(),notes.getUser().getId()); // Add parentheses for getUserId()
    }


    /*public Notes getNoteById(Long id) {
        return notesRepository.findById(id).orElse(null);
    }*/


    // Delete a note by its ID
    public void deleteNoteById(Long id) {
        notesRepository.deleteById(id);
    }

    // Update the description of a note
   /* public Notes updateNote(Long id, String newDescription) {
        Notes note = notesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        note.setDescription(newDescription);
        return notesRepository.save(note);
    }*/

}
