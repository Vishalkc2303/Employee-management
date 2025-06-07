package com.poject.employee.Service;

import com.poject.employee.DTO.DepartmentDto;
import com.poject.employee.Entity.Department;
import com.poject.employee.Repo.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        Optional<Department> department = departmentRepository.findById(id);
        return department.orElse(null); // Return null if not found
    }

    /*public Department createDepartment(Department department) {
        if (departmentRepository.existsByName(department.getName())) {
            return null; // Or handle it appropriately, maybe return an error object or throw generic exception
        }

        return departmentRepository.save(department);
    }*/

    public Department createDepartment(DepartmentDto departmentDTO) {
        // Check if the department already exists by name
        if (departmentRepository.existsByName(departmentDTO.getName())) {
            return null; // Or handle it appropriately, maybe return an error object or throw an exception
        }

        // Map the DTO to the entity
        Department department = new Department();
        department.setName(departmentDTO.getName());
        department.setDescription(departmentDTO.getDescription());

        // Save and return the saved department entity
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, DepartmentDto departmentDto) {
        // Find the department by ID
        Department department = departmentRepository.findById(id).orElse(null);

        // If department not found, return null
        if (department == null) {
            return null;
        }

        // Update the department details with values from the DTO
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());

        // Save the updated department and return it
        return departmentRepository.save(department);
    }

    /*public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = getDepartmentById(id);
        if (department == null) {
            return null;
        }

        // Check if a different department already has the new name
        if (!department.getName().equals(departmentDetails.getName()) &&
                departmentRepository.existsByName(departmentDetails.getName())) {
            return null;
        }

        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());

        return departmentRepository.save(department);
    }*/

    public boolean deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        if (department == null) {
            return false;
        }

        departmentRepository.delete(department);
        return true;
    }
}
