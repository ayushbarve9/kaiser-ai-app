## 2024-05-18 - Component Memoization
**Learning:** `ComplaintCard` and `GoogleMapComplaintMarker` components are mapped over repeatedly in large sets. Since they take simple props (or only `complaint`), they benefit significantly from `React.memo()`.
**Action:** When working on lists and mapping items, wrap components with `React.memo` to prevent unnecessary re-renders when parent states change, unless the component relies heavily on changing context or complex props that would defeat the shallow comparison.
