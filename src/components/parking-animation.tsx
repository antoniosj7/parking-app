// Antonio SJ
import { cn } from "@/lib/utils";
import styles from "./parking-animation.module.css";

// Un SVG de coche con una forma más definida y estilizada
const CarSvg = ({ className }: { className?: string }) => (
  <svg
    className={cn(styles.car, className)}
    viewBox="0 0 70 40" // Ajustamos el viewBox para la nueva forma
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 20 C0 20, 0 10, 10 10 L20 5 C25 2, 45 2, 50 5 L60 10 C70 10, 70 20, 65 20 L63 22 C60 25, 60 30, 63 32 L65 35 C70 35, 70 38, 65 38 H5 C0 38, 0 35, 5 35 L7 32 C10 30, 10 25, 7 22 L5 20 Z" />
  </svg>
);


export default function ParkingAnimation() {
  return (
    <div className={styles.container}>
      <div className={styles.road}>
        {/* Varios coches pasando a diferentes velocidades y tiempos */}
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
      </div>
    </div>
  );
}
