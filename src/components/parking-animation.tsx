// Antonio SJ
import { cn } from "@/lib/utils";
import styles from "./parking-animation.module.css";

// Un SVG de coche con estilo de contorno, inspirado en la imagen de referencia.
const CarSvg = ({ className }: { className?: string }) => (
  <svg
    className={cn(styles.car, className)}
    viewBox="0 0 200 75"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5,42.5 C1,38 1,28 10,23 L35,8 C40,5 55,5 60,8 L105,8 C110,5 125,5 130,8 L170,23 C180,28 180,38 170,42.5 L158,50 L158,60 C158,65 154,70 148,70 L130,70 C125,70 120,65 120,60 L120,58 L60,58 L60,60 C60,65 55,70 50,70 L32,70 C26,70 22,65 22,60 L22,50 L10.5,42.5 Z"
    />
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
