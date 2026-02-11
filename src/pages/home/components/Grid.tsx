import { useRef, useEffect } from 'react';

const BulgeGrid = ({ 
  gridSize = 40, 
  bulgeRadius = 100, 
  bulgeStrength = 10,
  lineColor = 'rgba(0, 212, 255, 0.05)',
  dotColor = 'rgba(0, 212, 255, 0.01)',
  className = ''
}) => {
  const canvasRef = useRef<any>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pointsRef = useRef<any>([]);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initPoints();
    };

    const initPoints = () => {
      const points = [];
      const cols = Math.ceil(canvas.width / gridSize) + 2;
      const rows = Math.ceil(canvas.height / gridSize) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          points.push({
            x: i * gridSize,
            y: j * gridSize,
            originX: i * gridSize,
            originY: j * gridSize,
          });
        }
      }
      pointsRef.current = points;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // Update points based on mouse position
      points.forEach((point:any) => {
        const dx = mouse.x - point.originX;
        const dy = mouse.y - point.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < bulgeRadius) {
          const force = (bulgeRadius - dist) / bulgeRadius;
          const angle = Math.atan2(dy, dx);
          // Push points away from mouse (bulge outward)
          point.x = point.originX - Math.cos(angle) * force * bulgeStrength;
          point.y = point.originY - Math.sin(angle) * force * bulgeStrength;
        } else {
          // Smooth return to origin
          point.x += (point.originX - point.x) * 0.1;
          point.y += (point.originY - point.y) * 0.1;
        }
      });

      const cols = Math.ceil(canvas.width / gridSize) + 2;
      const rows = Math.ceil(canvas.height / gridSize) + 2;

      ctx.lineWidth = 1;

      // Helper to calculate opacity based on distance from mouse
      const getLineOpacity = (point1: any, point2: any) => {
        const midX = (point1.x + point2.x) / 2;
        const midY = (point1.y + point2.y) / 2;
        const dx = mouse.x - midX;
        const dy = mouse.y - midY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < bulgeRadius) {
          // Increase opacity near mouse (from base 0.05 up to 0.25)
          const proximity = (bulgeRadius - dist) / bulgeRadius;
          return 0.04 + proximity * 0.1;
        }
        return 0.04; // Base opacity
      };

      // Draw horizontal lines with dynamic opacity
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const point = points[i * rows + j];
          const nextPoint = points[(i + 1) * rows + j];
          if (point && nextPoint) {
            const opacity = getLineOpacity(point, nextPoint);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
          }
        }
      }

      // Draw vertical lines with dynamic opacity
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows - 1; j++) {
          const point = points[i * rows + j];
          const nextPoint = points[i * rows + (j + 1)];
          if (point && nextPoint) {
            const opacity = getLineOpacity(point, nextPoint);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing dots near mouse
      points.forEach((point:any) => {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < bulgeRadius) {
          const opacity = ((bulgeRadius - dist) / bulgeRadius) * 0.1;
          const size = 1 + ((bulgeRadius - dist) / bulgeRadius) /2;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = dotColor.replace(/[\d.]+\)$/, `${opacity})`);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e:any) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleResize = () => {
      initCanvas();
    };

    // Initialize
    initCanvas();
    draw();

    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gridSize, bulgeRadius, bulgeStrength, lineColor, dotColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
};

export default BulgeGrid;
