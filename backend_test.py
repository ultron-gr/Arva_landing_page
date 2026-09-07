"""
ARVA Studios Backend API Testing
Tests all /api endpoints with validation, honeypot, rate limiting, and Supabase verification.
"""
import requests
import sys
import time
from datetime import datetime

# Configuration
BASE_URL = "https://arva-studios-site.preview.emergentagent.com/api"
SUPABASE_URL = "https://ggoshylygzwkefycsdco.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnb3NoeWx5Z3p3a2VmeWNzZGNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODMwNjM3MiwiZXhwIjoyMTAzODgyMzcyfQ.N9jpdWChlh-GDk5pkC-V_InP35FH3Uoyk23QmJ6NKfU"
TEST_EMAIL = "qa-agent-test@arvatest.dev"

class ARVABackendTester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.test_lead_ids = []
        self.test_emails = []
        
    def log(self, emoji, message):
        """Print formatted test output"""
        print(f"{emoji} {message}")
        
    def run_test(self, name, test_func):
        """Run a single test and track results"""
        self.tests_run += 1
        self.log("🔍", f"Testing: {name}")
        try:
            test_func()
            self.tests_passed += 1
            self.log("✅", f"PASSED: {name}")
            return True
        except AssertionError as e:
            self.log("❌", f"FAILED: {name} - {str(e)}")
            return False
        except Exception as e:
            self.log("❌", f"ERROR: {name} - {type(e).__name__}: {str(e)}")
            return False
    
    def sb_headers(self):
        """Supabase REST headers"""
        return {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Accept-Profile": "studio_site",
            "Content-Profile": "studio_site",
            "Content-Type": "application/json",
        }
    
    # ========== API TESTS ==========
    
    def test_health(self):
        """Test GET /api/health"""
        r = requests.get(f"{BASE_URL}/health", timeout=10)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert data.get("status") == "healthy", f"Expected healthy status, got {data.get('status')}"
        assert data.get("supabase") == "connected", f"Expected connected supabase, got {data.get('supabase')}"
        self.log("  ", f"Response: {data}")
    
    def test_leads_happy_path(self):
        """Test POST /api/leads with valid data"""
        payload = {
            "name": "QA Test User",
            "email": TEST_EMAIL,
            "company": "ARVA Test Co",
            "project_type": "web_products",
            "budget_range": "₹50,000–1,00,000",
            "message": "This is a test submission from the QA agent."
        }
        r = requests.post(f"{BASE_URL}/leads", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert data.get("ok") is True, f"Expected ok=true, got {data}"
        self.log("  ", f"Response: {data}")
        self.test_emails.append(TEST_EMAIL)
    
    def test_leads_empty_body(self):
        """Test POST /api/leads with empty body"""
        r = requests.post(f"{BASE_URL}/leads", json={}, timeout=10)
        assert r.status_code == 400, f"Expected 400, got {r.status_code}"
        data = r.json()
        assert data.get("ok") is False, f"Expected ok=false, got {data}"
        assert "errors" in data, f"Expected errors field, got {data}"
        errors = data["errors"]
        assert "name" in errors, f"Expected name error, got {errors}"
        assert "email" in errors, f"Expected email error, got {errors}"
        assert "project_type" in errors, f"Expected project_type error, got {errors}"
        self.log("  ", f"Validation errors: {errors}")
    
    def test_leads_invalid_email(self):
        """Test POST /api/leads with invalid email"""
        payload = {
            "name": "Test User",
            "email": "foo@bar",
            "project_type": "content_video"
        }
        r = requests.post(f"{BASE_URL}/leads", json=payload, timeout=10)
        assert r.status_code == 400, f"Expected 400, got {r.status_code}"
        data = r.json()
        assert data.get("ok") is False, f"Expected ok=false"
        assert "errors" in data and "email" in data["errors"], f"Expected email error, got {data}"
        self.log("  ", f"Email validation error: {data['errors']['email']}")
    
    def test_leads_invalid_project_type(self):
        """Test POST /api/leads with invalid project_type"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "project_type": "invalid_type"
        }
        r = requests.post(f"{BASE_URL}/leads", json=payload, timeout=10)
        assert r.status_code == 400, f"Expected 400, got {r.status_code}"
        data = r.json()
        assert data.get("ok") is False, f"Expected ok=false"
        assert "errors" in data and "project_type" in data["errors"], f"Expected project_type error, got {data}"
        self.log("  ", f"Project type validation error: {data['errors']['project_type']}")
    
    def test_leads_honeypot(self):
        """Test POST /api/leads with honeypot field filled"""
        honeypot_email = f"honeypot-{int(time.time())}@spam.com"
        payload = {
            "name": "Spam Bot",
            "email": honeypot_email,
            "project_type": "web_products",
            "website_url": "http://spam.com"  # honeypot field
        }
        r = requests.post(f"{BASE_URL}/leads", json=payload, timeout=10)
        # Should return 200 (fake success) but not insert into DB
        assert r.status_code == 200, f"Expected 200 (fake success), got {r.status_code}"
        data = r.json()
        assert data.get("ok") is True, f"Expected ok=true (fake), got {data}"
        self.log("  ", f"Honeypot triggered correctly - fake success returned")
        self.test_emails.append(honeypot_email)
    
    def test_leads_simulated_db_failure(self):
        """Test POST /api/leads with X-Simulate: db_failure header"""
        payload = {
            "name": "DB Failure Test",
            "email": f"db-test-{int(time.time())}@arvatest.dev",
            "project_type": "automation_ai"
        }
        headers = {"X-Simulate": "db_failure"}
        r = requests.post(f"{BASE_URL}/leads", json=payload, headers=headers, timeout=15)
        # Should return 200 because notification email fallback succeeds
        assert r.status_code == 200, f"Expected 200 (fallback success), got {r.status_code}: {r.text}"
        data = r.json()
        assert data.get("ok") is True, f"Expected ok=true (fallback), got {data}"
        self.log("  ", f"DB failure handled with email fallback: {data}")
        self.test_emails.append(payload["email"])
    
    def test_leads_simulated_email_failure(self):
        """Test POST /api/leads with X-Simulate: email_failure header"""
        payload = {
            "name": "Email Failure Test",
            "email": f"email-test-{int(time.time())}@arvatest.dev",
            "project_type": "brand_design"
        }
        headers = {"X-Simulate": "email_failure"}
        r = requests.post(f"{BASE_URL}/leads", json=payload, headers=headers, timeout=15)
        # Should return 200 because DB insert succeeded
        assert r.status_code == 200, f"Expected 200 (DB success), got {r.status_code}: {r.text}"
        data = r.json()
        assert data.get("ok") is True, f"Expected ok=true (DB stored), got {data}"
        self.log("  ", f"Email failure handled (DB stored): {data}")
        self.test_emails.append(payload["email"])
    
    def test_leads_rate_limiting(self):
        """Test POST /api/leads rate limiting (6 rapid requests)"""
        base_email = f"rate-test-{int(time.time())}"
        results = []
        
        for i in range(6):
            payload = {
                "name": f"Rate Test {i+1}",
                "email": f"{base_email}-{i}@arvatest.dev",
                "project_type": "not_sure"
            }
            r = requests.post(f"{BASE_URL}/leads", json=payload, timeout=15)
            results.append((i+1, r.status_code, r.json()))
            self.test_emails.append(payload["email"])
            time.sleep(0.2)  # Small delay between requests
        
        # First 5 should succeed (200), 6th should be rate limited (429)
        for i in range(5):
            num, status, data = results[i]
            assert status == 200, f"Request {num} should succeed, got {status}: {data}"
            self.log("  ", f"Request {num}: {status} - {data.get('message', data.get('error'))}")
        
        num, status, data = results[5]
        assert status == 429, f"Request 6 should be rate limited (429), got {status}: {data}"
        assert data.get("ok") is False, f"Expected ok=false for rate limit"
        assert "fallback_email" in data, f"Expected fallback_email in response"
        self.log("  ", f"Request 6: {status} - Rate limited correctly: {data.get('error')}")
    
    # ========== SUPABASE VERIFICATION ==========
    
    def test_supabase_verify_lead(self):
        """Verify lead was inserted into Supabase"""
        # Query for our test email
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/leads",
            headers=self.sb_headers(),
            params={"email": f"eq.{TEST_EMAIL}", "select": "id,name,email,project_type,source"},
            timeout=10
        )
        assert r.status_code == 200, f"Supabase query failed: {r.status_code}"
        rows = r.json()
        assert len(rows) > 0, f"No lead found for {TEST_EMAIL}"
        lead = rows[0]
        self.test_lead_ids.append(lead["id"])
        self.log("  ", f"Found lead in Supabase: {lead}")
        assert lead["name"] == "QA Test User", f"Name mismatch"
        assert lead["project_type"] == "web_products", f"Project type mismatch"
        assert lead["source"] == "website", f"Source mismatch"
    
    def test_supabase_verify_email_log(self):
        """Verify email_log entries exist"""
        if not self.test_lead_ids:
            self.log("⚠️ ", "No lead IDs to check email_log")
            return
        
        lead_id = self.test_lead_ids[0]
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/email_log",
            headers=self.sb_headers(),
            params={"lead_id": f"eq.{lead_id}", "select": "email_type,status"},
            timeout=10
        )
        assert r.status_code == 200, f"email_log query failed: {r.status_code}"
        logs = r.json()
        assert len(logs) >= 2, f"Expected at least 2 email_log entries (notification + confirmation), got {len(logs)}"
        
        # Check notification email
        notification = next((l for l in logs if l["email_type"] == "notification"), None)
        assert notification is not None, "No notification email log found"
        assert notification["status"] == "sent", f"Notification should be sent, got {notification['status']}"
        self.log("  ", f"Notification email: {notification['status']}")
        
        # Check confirmation email (expected to fail in sandbox mode)
        confirmation = next((l for l in logs if l["email_type"] == "confirmation"), None)
        assert confirmation is not None, "No confirmation email log found"
        assert confirmation["status"] == "failed", f"Confirmation should fail (sandbox), got {confirmation['status']}"
        self.log("  ", f"Confirmation email: {confirmation['status']} (EXPECTED - sandbox mode)")
    
    def test_supabase_verify_honeypot_not_inserted(self):
        """Verify honeypot submission was NOT inserted"""
        # Query for honeypot email
        honeypot_email = [e for e in self.test_emails if "spam.com" in e]
        if not honeypot_email:
            self.log("⚠️ ", "No honeypot email to verify")
            return
        
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/leads",
            headers=self.sb_headers(),
            params={"email": f"eq.{honeypot_email[0]}", "select": "id"},
            timeout=10
        )
        assert r.status_code == 200, f"Supabase query failed: {r.status_code}"
        rows = r.json()
        assert len(rows) == 0, f"Honeypot submission should NOT be in DB, but found {len(rows)} rows"
        self.log("  ", f"Honeypot correctly blocked - no DB entry for {honeypot_email[0]}")
    
    # ========== CLEANUP ==========
    
    def cleanup_test_data(self):
        """Delete test data from Supabase"""
        self.log("🧹", "Cleaning up test data...")
        
        # Delete email_log entries first (foreign key constraint)
        if self.test_lead_ids:
            for lead_id in self.test_lead_ids:
                try:
                    r = requests.delete(
                        f"{SUPABASE_URL}/rest/v1/email_log",
                        headers=self.sb_headers(),
                        params={"lead_id": f"eq.{lead_id}"},
                        timeout=10
                    )
                    if r.status_code in (200, 204):
                        self.log("  ", f"Deleted email_log for lead {lead_id}")
                except Exception as e:
                    self.log("⚠️ ", f"Failed to delete email_log for {lead_id}: {e}")
        
        # Delete leads
        for email in self.test_emails:
            try:
                r = requests.delete(
                    f"{SUPABASE_URL}/rest/v1/leads",
                    headers=self.sb_headers(),
                    params={"email": f"eq.{email}"},
                    timeout=10
                )
                if r.status_code in (200, 204):
                    self.log("  ", f"Deleted lead: {email}")
            except Exception as e:
                self.log("⚠️ ", f"Failed to delete lead {email}: {e}")
        
        self.log("✅", "Cleanup complete")
    
    # ========== RUN ALL TESTS ==========
    
    def run_all(self):
        """Execute all tests in sequence"""
        print("\n" + "="*70)
        print("ARVA STUDIOS BACKEND API TESTS")
        print("="*70 + "\n")
        
        # Health check
        self.run_test("GET /api/health", self.test_health)
        
        # Lead form validation tests
        self.run_test("POST /api/leads - Happy path", self.test_leads_happy_path)
        self.run_test("POST /api/leads - Empty body validation", self.test_leads_empty_body)
        self.run_test("POST /api/leads - Invalid email", self.test_leads_invalid_email)
        self.run_test("POST /api/leads - Invalid project_type", self.test_leads_invalid_project_type)
        
        # Security & edge cases
        self.run_test("POST /api/leads - Honeypot detection", self.test_leads_honeypot)
        self.run_test("POST /api/leads - Simulated DB failure", self.test_leads_simulated_db_failure)
        self.run_test("POST /api/leads - Simulated email failure", self.test_leads_simulated_email_failure)
        self.run_test("POST /api/leads - Rate limiting", self.test_leads_rate_limiting)
        
        # Supabase verification
        self.run_test("Supabase - Verify lead insertion", self.test_supabase_verify_lead)
        self.run_test("Supabase - Verify email_log entries", self.test_supabase_verify_email_log)
        self.run_test("Supabase - Verify honeypot NOT inserted", self.test_supabase_verify_honeypot_not_inserted)
        
        # Cleanup
        self.cleanup_test_data()
        
        # Summary
        print("\n" + "="*70)
        print(f"RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*70 + "\n")
        
        return 0 if self.tests_passed == self.tests_run else 1


if __name__ == "__main__":
    tester = ARVABackendTester()
    sys.exit(tester.run_all())
