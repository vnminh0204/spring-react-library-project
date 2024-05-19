package com.libraryspringboot.controllers;

import com.libraryspringboot.models.AddBookRequest;
import com.libraryspringboot.services.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Admin")
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @CrossOrigin
    @PutMapping("/secure/increase/book/quantity/")
    public void increaseBookQuantity(
            Authentication authentication,
            @RequestParam Long bookId
    ) throws Exception {
        var claims = ((Jwt) authentication.getPrincipal()).getClaims();
        var userType = ((String) claims.get("userType")).toLowerCase();
        if (userType == null || !userType.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.increaseBookQuantity(bookId);
    }

    @CrossOrigin
    @PutMapping("/secure/decrease/book/quantity/")
    public void decreaseBookQuantity(
            Authentication authentication,
            @RequestParam Long bookId
    ) throws Exception {
        var claims = ((Jwt) authentication.getPrincipal()).getClaims();
        var userType = ((String) claims.get("userType")).toLowerCase();
        if (userType == null || !userType.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.decreaseBookQuantity(bookId);
    }

    @CrossOrigin
    @PostMapping("/secure/add/book")
    public void postBook(
            Authentication authentication,
            @RequestBody AddBookRequest addBookRequest
    ) throws Exception {
        var claims = ((Jwt) authentication.getPrincipal()).getClaims();
        var userType = ((String) claims.get("userType")).toLowerCase();
        if (userType == null || !userType.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }

    @CrossOrigin
    @DeleteMapping("/secure/delete/book/")
    public void deleteBook(
            Authentication authentication,
            @RequestParam Long bookId) throws Exception {
        var claims = ((Jwt) authentication.getPrincipal()).getClaims();
        var userType = ((String) claims.get("userType")).toLowerCase();
        if (userType == null || !userType.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(bookId);
    }
}
