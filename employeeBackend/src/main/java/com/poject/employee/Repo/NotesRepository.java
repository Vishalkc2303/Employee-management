package com.poject.employee.Repo;

import com.poject.employee.Entity.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotesRepository extends JpaRepository<Notes, Long> {

    List<Notes> findAllByUserIdOrderByIdDesc(Long userId);
    /*@Query("SELECT n FROM Notes n ORDER BY n.id DESC")
    List<Notes> findTop3ByUserIdOrderByIdDesc(Long userId);*/

    List<Notes> findTop3ByUserIdOrderByIdDesc(Long userId);

}
