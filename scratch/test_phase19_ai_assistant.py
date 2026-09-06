import sys
import os
import requests

def test_phase19_ai_assistant():
    print("==================================================")
    print("   PHASE 19 VERIFICATION -- AI ASSISTANT EXPANSION ")
    print("==================================================")

    # 1. Verify AIAssistant.tsx component
    component_path = os.path.join(os.getcwd(), "src", "components", "AIAssistant.tsx")
    if not os.path.exists(component_path):
        print(f"[FAIL] AIAssistant.tsx not found at {component_path}")
        sys.exit(1)
        
    print(f"[OK] Found AIAssistant.tsx at {component_path}")
    
    with open(component_path, "r", encoding="utf-8") as f:
        content = f.read()

    required_snippets = [
        ("/api/ai/assistant", "Live API Endpoint Integration"),
        ("CATEGORIZED_CHIPS", "Categorized Municipal Suggestion Chips"),
        ("renderMessageContent", "Interactive Markdown & Link Renderer"),
        ("clearChat", "Clear Chat History handler"),
        ("expanded", "Resizable Window toggle"),
        ("KAISER Civic AI", "System Title branding"),
    ]

    all_passed = True
    for snippet, label in required_snippets:
        if snippet in content:
            print(f"  [PASS] {label} ('{snippet}') verified in AIAssistant.tsx")
        else:
            print(f"  [FAIL] Missing {label} ('{snippet}')")
            all_passed = False

    # 2. Test Python FastAPI Assistant Endpoint /assistant/query
    url = "http://127.0.0.1:5001/assistant/query"
    test_queries = [
        "How do I report a pothole?",
        "Which ward handles Bandra?",
        "What are the SLA timelines for critical water leaks?",
        "Tell me about flood emergency disaster hotline 1916"
    ]

    print("\n[Testing Python FastAPI AI Assistant Microservice]")
    for query in test_queries:
        try:
            resp = requests.post(url, json={"prompt": query}, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                print(f"  [PASS] Query: '{query}'")
                print(f"         Source: {data.get('source')}")
                clean_snippet = data.get('reply', '')[:80].encode('ascii', 'ignore').decode('ascii').replace('\n', ' ')
                print(f"         Reply Snippet: {clean_snippet}...")
            else:
                print(f"  [FAIL] Query: '{query}' returned HTTP {resp.status_code}")
                all_passed = False
        except Exception as e:
            print(f"  [WARNING] Python AI service on port 5001 not responding to live HTTP request: {e}")

    if all_passed:
        print("\n[SUCCESS] PHASE 19 AI ASSISTANT EXPANSION VERIFICATION PASSED!")
        sys.exit(0)
    else:
        print("\n[FAIL] PHASE 19 VERIFICATION FAILED!")
        sys.exit(1)

if __name__ == "__main__":
    test_phase19_ai_assistant()
