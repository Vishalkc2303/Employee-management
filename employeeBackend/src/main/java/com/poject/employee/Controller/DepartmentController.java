// 4. Controller - DepartmentController.java
package com.poject.employee.Controller;


import com.poject.employee.DTO.DepartmentDto;
import com.poject.employee.Entity.Department;
import com.poject.employee.Service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        Department department = departmentService.getDepartmentById(id);
        return new ResponseEntity<>(department, HttpStatus.OK);
    }

    /*@PostMapping("/create")
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        System.out.println("hiiii" + department);
        Department newDepartment = departmentService.createDepartment(department);
        return new ResponseEntity<>(newDepartment, HttpStatus.CREATED);
    }*/


    @PostMapping("/create")
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody DepartmentDto DepartmentDto) {
        Department newDepartment = departmentService.createDepartment(DepartmentDto);

        if (newDepartment == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // or return an appropriate error message
        }

        // Convert the saved Department to DTO before returning
        DepartmentDto responseDTO = new DepartmentDto(
                newDepartment.getId(),
                newDepartment.getName(),
                newDepartment.getDescription()
        );

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }
    /*@PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
             @RequestBody Department departmentDetails) {
        Department updatedDepartment = departmentService.updateDepartment(id, departmentDetails);
        return new ResponseEntity<>(updatedDepartment, HttpStatus.OK);
    }*/

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(
            @PathVariable Long id,
            @RequestBody DepartmentDto departmentDto) {

        // Call the service to update the department with the DTO data
        Department updatedDepartment = departmentService.updateDepartment(id, departmentDto);

        // If the department was not found, return a 404 Not Found response
        if (updatedDepartment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Convert the updated entity back to DTO and return it
        DepartmentDto updatedDepartmentDto = new DepartmentDto(
                updatedDepartment.getId(),
                updatedDepartment.getName(),
                updatedDepartment.getDescription()
        );

        return new ResponseEntity<>(updatedDepartmentDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}