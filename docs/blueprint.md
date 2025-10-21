# **App Name**: PUMG

## Core Features:

- Real-time Parking Grid: Displays the availability of parking spots in real-time using data from Firestore.
- User Authentication & Authorization: Firebase Authentication to manage user accounts with custom claims for admin/user roles and protected routes.
- Smart Gate Control: Cloud Function triggered by parking spot changes to automatically open/close the gate based on reservations and occupancy.
- Waitlist Notification: Cloud Function triggered when a spot becomes free, notifying the first user on the waitlist via FCM.
- Cache Metrics Dashboard: Admin dashboard displaying cache metrics (hits, misses, latency) fetched via an API endpoint.
- Parking Spot Occupancy Prediction: Leverage historical parking data to predict spot occupancy using a trained AI tool, influencing dynamic pricing and reservation availability.
- Admin Session Management: Allows admins to manage parking sessions, calculate costs, and manually assign or force reservations.
- Storage Hierarchy Evolution: Implements a three-tier storage hierarchy: RAM (cache), Firestore (real-time), and BigQuery (cold storage) for parking data.
- Cache Block Mapping: Provides configurable cache policies (direct-mapped, set-associative, fully-associative) with metrics for performance analysis.
- TLB (Translation Lookaside Buffer): Software TLB to cache mappings between reservation/spot IDs and device information for faster gate opening.

## Style Guidelines:

- Primary color: Deep blue (#08268a) to convey trust, security and order.
- Background color: Light gray (#c8eafa) for a clean, modern feel.
- Accent color: Bright orange (#5407b8) for highlighting important actions and CTAs.
- Headline font: 'Space Grotesk' (sans-serif) for a techy, modern headline. Body Font: 'Inter' (sans-serif) for a clean and readable experience.
- Use consistent, minimalist icons from a library like FontAwesome or Material Icons for parking spots, reservations, and user actions.
- Implement a responsive grid layout for the parking grid and dashboards, ensuring usability across devices.
- Subtle transitions and animations to indicate state changes (e.g., parking spot availability, reservation confirmation).