import React, { useEffect, useRef } from 'react';

interface CommentLineConnectorProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const CommentLineConnector: React.FC<CommentLineConnectorProps> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawConnectors = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get the container's dimensions and position
      const containerRect = container.getBoundingClientRect();
      
      // Set canvas dimensions to match container
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Find all parent comments
      const parentComments = container.querySelectorAll('[id^="comment-"]');
      
      parentComments.forEach(parentComment => {
        const parentId = parentComment.id.replace('comment-', '');
        const parentAvatar = parentComment.querySelector('.avatar-parent') as HTMLElement;
        
        if (!parentAvatar) return;
        
        // Find all replies for this parent
        const replyContainer = parentComment.querySelector('.replies-container');
        if (!replyContainer) return;
        
        const replies = replyContainer.querySelectorAll('.reply-comment');
        
        if (replies.length === 0) return;
        
        // Get parent avatar position
        const parentRect = parentAvatar.getBoundingClientRect();
        
        // Calculate starting point (center bottom of parent avatar)
        const startX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const startY = parentRect.top + parentRect.height - containerRect.top;
        
        // Draw vertical line down from parent avatar
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Find the last reply to determine how far down to draw the vertical line
        const lastReply = replies[replies.length - 1];
        const lastReplyAvatar = lastReply.querySelector('.avatar-reply') as HTMLElement;
        
        if (!lastReplyAvatar) return;
        
        const lastReplyRect = lastReplyAvatar.getBoundingClientRect();
        const endY = lastReplyRect.top + lastReplyRect.height / 2 - containerRect.top;
        // Draw the main vertical line - make it shorter
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Make the vertical line shorter by not extending all the way to the last reply
        // Instead, stop at the Y position of the last reply minus 15px
        const shorterEndY = endY - 15;
        
        ctx.lineTo(startX, shorterEndY);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Very light black (30% opacity)
        ctx.lineWidth = 1; // Thin line
        ctx.stroke();
        
        // Draw horizontal lines to each reply
        replies.forEach(reply => {
          const replyAvatar = reply.querySelector('.avatar-reply') as HTMLElement;
          if (!replyAvatar) return;
          
          const replyRect = replyAvatar.getBoundingClientRect();
          const replyX = replyRect.left + replyRect.width / 2 - containerRect.left;
          const replyY = replyRect.top + replyRect.height / 2 - containerRect.top;
          
          // Draw horizontal line to this reply with rounded corners
          const curveRadius = 15; // Increased radius for more pronounced rounding
          
          // We'll draw the connection in segments to ensure proper rounded corners
          ctx.beginPath();
          
          // For the left corner (where horizontal meets vertical)
          // First move to a point on the vertical line
          ctx.moveTo(startX, replyY - curveRadius);
          
          // Draw the left rounded corner
          ctx.arcTo(
            startX, replyY, // Point on the vertical line
            startX + curveRadius, replyY, // Point on the horizontal line
            curveRadius // Radius of the curve
          );
          
          // Draw the horizontal line - make it shorter by adjusting the endpoint
          if (replyX > startX) {
            // If reply is to the right of the vertical line
            // Make the line shorter by 5px from the avatar
            ctx.lineTo(replyX - 5, replyY);
          } else {
            // If reply is to the left of the vertical line
            // Make the line shorter by 5px from the avatar
            ctx.lineTo(replyX + 5, replyY);
          }
          
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Very light black (30% opacity)
          ctx.lineWidth = 1; // Thin line
          ctx.stroke(); // Remove duplicate stroke call
        });
      });
    };

    // Initial draw
    drawConnectors();
    
    // Redraw on window resize
    window.addEventListener('resize', drawConnectors);
    
    // Redraw on content changes (using MutationObserver)
    const observer = new MutationObserver(drawConnectors);
    observer.observe(containerRef.current, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', drawConnectors);
      observer.disconnect();
    };
  }, [containerRef]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
};
