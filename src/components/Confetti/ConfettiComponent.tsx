import React, { useRef, useEffect, useState } from 'react';
import './ConfettiStyles.css';

interface ConfettiProps {
  trigger: boolean;
}

const ConfettiComponent: React.FC<ConfettiProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const confettiAnimationRef = useRef<number | null>(null);
  const confettiRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
  }>>([]);

  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  ];

  // تنظیم کانوس بعد از رندر اولیه
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error('Could not get 2D context for canvas.');
      return;
    }
    
    setCtx(context);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // تنظیم مجدد ابعاد کانوس با تغییر ابعاد پنجره
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stopConfetti();
    };
  }, []);

  // شروع انیمیشن با تغییر trigger
  useEffect(() => {
    if (trigger) {
      startConfetti();
    }
  }, [trigger]);

  const startConfetti = () => {
    if (!ctx) return;
    
    confettiRef.current = [];
    
    // ایجاد ذرات کاغذ رنگی
    for (let i = 0; i < 150; i++) {
      confettiRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -100,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 5 + 1,
        angle: Math.random() * Math.PI * 2,
        rotation: 0,
        rotationSpeed: Math.random() * 0.2 - 0.1,
      });
    }
    
    animateConfetti();
  };

  const animateConfetti = () => {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    let stillFalling = false;
    
    for (const particle of confettiRef.current) {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      
      ctx.restore();
      
      // به‌روزرسانی موقعیت
      particle.x += Math.cos(particle.angle) * 2;
      particle.y += particle.speed;
      particle.rotation += particle.rotationSpeed;
      
      // بررسی اینکه آیا ذره هنوز در صفحه است
      if (particle.y < window.innerHeight) {
        stillFalling = true;
      }
    }
    
    if (stillFalling) {
      confettiAnimationRef.current = requestAnimationFrame(animateConfetti);
    } else {
      stopConfetti();
    }
  };

  const stopConfetti = () => {
    if (confettiAnimationRef.current) {
      cancelAnimationFrame(confettiAnimationRef.current);
      confettiAnimationRef.current = null;
    }
    
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  return <canvas ref={canvasRef} className="confetti-canvas" />;
};

export default ConfettiComponent; 