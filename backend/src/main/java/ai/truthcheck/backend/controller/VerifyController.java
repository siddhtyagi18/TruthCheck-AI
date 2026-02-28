package ai.truthcheck.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class VerifyController {

    @PostMapping("/verify/text")
    public Map<String, Object> verifyText(@RequestBody Map<String, Object> req) {

        // Python AI service URL
        String aiUrl = "http://localhost:8000/ai/verify";

        // Send request to python service
        RestTemplate rest = new RestTemplate();
        Map<String, Object> pythonResponse = rest.postForObject(aiUrl, req, Map.class);

        // Return python response
        return pythonResponse;
    }
}
