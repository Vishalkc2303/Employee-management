package com.poject.employee.Controller;

import com.poject.employee.DTO.WorkReportDto;
import com.poject.employee.DTO.WorkReportResponseDto;
import com.poject.employee.DTO.WorkReportUpdateRequestDto;
import com.poject.employee.Entity.WorkReport;
import com.poject.employee.Service.WorkReportService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/work-reports")
public class WorkReportController {

    @Autowired
    private WorkReportService workReportService;

    // Endpoint to get all work reports
    /*@GetMapping
    public ResponseEntity<List<WorkReportResponseDto>> getAllWorkReports() {
        List<WorkReportResponseDto> reports = workReportService.getAllWorkReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }*/
    @GetMapping("/all")
    public ResponseEntity<List<WorkReportResponseDto>> getUSerAllWorkReports() {
        List<WorkReportResponseDto> reports = workReportService.getUSerAllWorkReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/all-work-reports")
    public ResponseEntity<List<WorkReportResponseDto>> getAllWorkReports() {
        List<WorkReportResponseDto> workReports = workReportService.getAllWorkReports();
        return ResponseEntity.ok(workReports);
    }

    @PutMapping("/status/{reportId}")
    public ResponseEntity<WorkReportResponseDto> updateWorkReport(
            @PathVariable Long reportId,
            @RequestBody WorkReportUpdateRequestDto updateRequest,
            HttpSession session) {

        // Fetching the userId from the session
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Update the work report
        WorkReport updatedReport = workReportService.updateWorkReport(reportId, updateRequest, userId);

        // Map the updated entity to a response DTO
        WorkReportResponseDto responseDto = workReportService.mapToResponse2DTO(updatedReport);

        return ResponseEntity.ok(responseDto);
    }

    /*@GetMapping("/date")
    public ResponseEntity<List<WorkReportResponseDto>> getWorkReportsByDate(
            @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {

        List<WorkReportResponseDto> reports = workReportService.getWorkReportsByDateRange(startDate, endDate);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }*/

    @GetMapping("/date")
    public ResponseEntity<List<WorkReportResponseDto>> getWorkReportsByDate(
            @RequestParam LocalDate date) {

        List<WorkReportResponseDto> reports = workReportService.getWorkReportsByDate(date);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }


    @GetMapping("/fetchByUser")
    public ResponseEntity<List<WorkReportResponseDto>> getWorkReportsByUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");  // Get userId from session

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // No user in session
        }

        List<WorkReportResponseDto> reports = workReportService.getWorkReportsByUserId(userId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    // Endpoint to get a single work report by ID
    /*@GetMapping("/{id}")
    public ResponseEntity<WorkReportResponseDto> getWorkReportById(@PathVariable Long id) {
        WorkReportResponseDto report = workReportService.getWorkReportById(id);
        if (report != null) {
            return new ResponseEntity<>(report, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }*/

    // Endpoint to create or update a work report
    /*@PostMapping
    public ResponseEntity<WorkReportResponseDto> saveOrUpdateWorkReport(@RequestBody WorkReportDto workReportDto) {
        WorkReportResponseDto savedReport = workReportService.saveOrUpdateWorkReport(workReportDto);
        return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
    }*/

   /* @PutMapping("/{id}")
    public ResponseEntity<WorkReportResponseDto> updateWorkReport(
            @PathVariable Long id, @RequestBody WorkReportDto workReportDto) {

        // Find the existing report by id
        Optional<WorkReport> existingReport = workReportRepository.findById(id);

        if (existingReport.isPresent()) {
            // Report found, update its fields
            WorkReport workReport = existingReport.get();
            workReport.update(workReportDto);  // Assuming there's an 'update' method on WorkReport to handle field updates

            // Save the updated report
            workReport = workReportRepository.save(workReport);

            // Return the updated report as a response DTO
            return new ResponseEntity<>(new WorkReportResponseDto(workReport), HttpStatus.OK);
        } else {
            // If the report doesn't exist, return a 'not found' response
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
*/

    @PostMapping
    public ResponseEntity<WorkReport> createWorkReport(@RequestBody WorkReportDto workReportDto, HttpSession session) {
        // Retrieve the userId from the session
        Long userId = (Long) session.getAttribute("userId"); // Assuming 'userId' is stored in session

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // If no userId found, return unauthorized
        }

        // Delegate to the service to handle the work report creation, passing the userId
        WorkReport createdReport = workReportService.createWorkReport(workReportDto, userId);

        return ResponseEntity.ok(createdReport);
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<WorkReportResponseDto> updateWorkReport(
            @PathVariable Long id, @RequestBody WorkReportDto workReportDto) {

        // Call the service method to update the report, passing the id directly
        WorkReportResponseDto updatedReport = workReportService.updateWorkReport( workReportDto);

        // Return the updated report
        return new ResponseEntity<>(updatedReport, HttpStatus.OK);
    }


    // Endpoint to delete a work report by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkReport(@PathVariable Long id) {
        boolean isDeleted = workReportService.deleteWorkReport(id);
        if (isDeleted) {
            return new ResponseEntity<>("Report deleted successfully", HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>("Report not found", HttpStatus.NOT_FOUND);
        }
    }
}
