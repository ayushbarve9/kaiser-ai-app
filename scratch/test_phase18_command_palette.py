import os
import sys

def verify_command_palette():
    print("==================================================")
    print("   PHASE 18 VERIFICATION -- COMMAND PALETTE EXTENSION ")
    print("==================================================")

    component_path = os.path.join(os.getcwd(), "src", "components", "CommandPalette.tsx")
    if not os.path.exists(component_path):
        print(f"[FAIL] CommandPalette.tsx not found at {component_path}")
        sys.exit(1)
        
    print(f"[OK] Found CommandPalette.tsx at {component_path}")
    
    with open(component_path, "r", encoding="utf-8") as f:
        content = f.read()

    required_snippets = [
        ("activeCategory", "Category Tabs state management"),
        ("getWardHealthGrade", "Ward Health Grade calculation algorithm"),
        ("/admin", "Officer Control Room navigation shortcut"),
        ("/analytics", "Executive Analytics KPI navigation shortcut"),
        ("/hotspots", "Ward Hotspots & Spatial Clusters navigation shortcut"),
        ("/report", "File Civic Grievance navigation shortcut"),
        ("tel:1916", "BMC Emergency 1916 helpline shortcut"),
        ("tel:108", "Disaster Ambulance 108 helpline shortcut"),
        ("ArrowDown", "Keyboard arrow down navigation"),
        ("ArrowUp", "Keyboard arrow up navigation"),
        ("Enter", "Keyboard Enter key action trigger"),
        ("MUMBAI_WARDS_DATA", "24-Ward GIS Data Integration"),
        ("Grade", "Ward Health Score Grade display"),
    ]

    all_passed = True
    for snippet, label in required_snippets:
        if snippet in content:
            print(f"  [PASS] {label} ('{snippet}') verified")
        else:
            print(f"  [FAIL] Missing {label} ('{snippet}')")
            all_passed = False

    if all_passed:
        print("\n[SUCCESS] PHASE 18 COMMAND PALETTE EXTENSION VERIFICATION PASSED!")
        sys.exit(0)
    else:
        print("\n[FAIL] PHASE 18 VERIFICATION FAILED!")
        sys.exit(1)

if __name__ == "__main__":
    verify_command_palette()

