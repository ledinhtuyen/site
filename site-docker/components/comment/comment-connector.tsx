import React, { useEffect, useRef } from 'react';

interface CommentConnectorProps {
  parentId: string;
  replyId: string;
}

export const CommentConnector: React.FC<CommentConnectorProps> = ({ parentId, replyId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawConnector = () => {
      const parentElement = document.getElementById(`comment-${parentId}`);
      const replyElement = document.getElementById(`reply-${replyId}`);
      
      if (!parentElement || !replyElement) return;
      
      // Get the parent avatar element
      const parentAvatar = parentElement.querySelector('.avatar-parent');
      // Get the reply avatar element
      const replyAvatar = replyElement.querySelector('.avatar-reply');
      
      if (!parentAvatar || !replyAvatar) return;
      
      // Get positions relative to the canvas
      const parentRect = parentAvatar.getBoundingClientRect();
      const replyRect = replyAvatar.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      
      // Calculate the starting and ending points
      const startX = parentRect.left + parentRect.width / 2 - canvasRect.left;
      const startY = parentRect.top + parentRect.height - canvasRect.top;
      const endX = replyRect.left + replyRect.width / 2 - canvasRect.left;
      const endY = replyRect.top + replyRect.height / 2 - canvasRect.top;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set the canvas dimensions to match the container
      canvas.width = canvasRect.width;
      canvas.height = canvasRect.height;
      
      // Draw the connector line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Create a curved line with rounded corners
      const controlX = startX;
      const controlY = (startY + endY) / 2;
      const curveRadius = 10; // Radius for the curve
      
      // First vertical segment
      ctx.lineTo(startX, controlY - curveRadius);
      
      // Curved corner
      if (endX > startX) {
        // If endpoint is to the right
        ctx.quadraticCurveTo(
          startX, controlY, // Control point
          startX + curveRadius, controlY // End point after curve
        );
        
        // Horizontal segment
        ctx.lineTo(endX - curveRadius, controlY);
        
        // Second curved corner
        ctx.quadraticCurveTo(
          endX, controlY, // Control point
          endX, controlY + curveRadius // End point after curve
        );
      } else {
        // If endpoint is to the left
        ctx.quadraticCurveTo(
          startX, controlY, // Control point
          startX - curveRadius, controlY // End point after curve
        );
        
        // Horizontal segment
        ctx.lineTo(endX + curveRadius, controlY);
        
        // Second curved corner
        ctx.quadraticCurveTo(
          endX, controlY, // Control point
          endX, controlY + curveRadius // End point after curve
        );
      }
      
      // Final vertical segment
      ctx.lineTo(endX, endY);
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Very light black (30% opacity)
      ctx.lineWidth = 1; // Thin line
      ctx.stroke();
    };

    // Draw initially
    drawConnector();
    
    // Redraw on window resize
    window.addEventListener('resize', drawConnector);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', drawConnector);
    };
  }, [parentId, replyId]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
};
