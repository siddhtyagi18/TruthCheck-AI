package ai.truthcheck.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class VerifyController {

    @PostMapping("/verify/text")
    public Map<String, Object> verifyText(@RequestBody Map<String, String> req) {
        Map<String, Object> response = new HashMap<>();
        response.put("verdict", "unsure");
        response.put("confidence", 0.0);
        response.put("service", "backend mock running");
        return response;
    }
}
