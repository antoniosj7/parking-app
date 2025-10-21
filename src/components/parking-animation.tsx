// Antonio SJ
import { cn } from "@/lib/utils";
import styles from "./parking-animation.module.css";

const CarSvg = ({ className }: { className?: string }) => (
  <svg
    className={cn(styles.car, className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 200"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M85,185 C95,170 100,150 100,125 L100,50 C100,25 90,10 75,5 L25,5 C10,10 0,25 0,50 L0,125 C0,150 5,170 15,185 L25,195 L75,195 L85,185 Z"
      stroke="hsl(var(--foreground))"
      strokeWidth="5"
      fill="hsl(var(--background))"
    />
    {/* Windshield */}
    <rect x="10" y="55" width="80" height="40" rx="10" ry="10" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="3" />
    {/* Rear window */}
    <rect x="10" y="110" width="80" height="30" rx="10" ry="10" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="3" />
    {/* Roof */}
    <line x1="10" y1="100" x2="90" y2="100" stroke="hsl(var(--foreground))" strokeWidth="3" />
  </svg>
);

export default function ParkingAnimation() {
  return (
    <div className={styles.container}>
      <div className={styles.parkingLot}>
        {/* Cars */}
        <div className={cn(styles.carWrapper, styles.car1)}>
          <CarSvg />
        </div>
        <div className={cn(styles.carWrapper, styles.car2)}>
          <CarSvg />
        </div>
        <div className={cn(styles.carWrapper, styles.car3)}>
          <CarSvg />
        </div>
        <div className={cn(styles.carWrapper, styles.car4)}>
          <CarSvg />
        </div>

        {/* Parking Lines */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.slot}>
            <div className={styles.line}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
