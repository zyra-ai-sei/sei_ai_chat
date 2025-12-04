import React from 'react';

// Styles object (CSS-in-JS)
const styles = {
  container: {
    backgroundColor: '#0F1115', // Dark background matching image
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  centerTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    color: '#9CA3AF', // Gray text
    fontSize: '14px',
    marginBottom: '4px',
    fontWeight: 500,
  },
  value: {
    fontSize: '48px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(180deg, #FFFFFF 0%, #A5B4FC 100%)', // White to Light Blue gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'
  }
};

const DonutChart = () => {
  // Configuration
  const size = 300;
  const strokeWidth = 32; // Slightly reduced for subtle rounded effect
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Data mirroring the image segments
  // Adjust 'value' to change segment size. 
  // We explicitly set the "Glow" segment.
  const data = [
    { color: '#8B5CF6', value: 30, glow: true },  // Top Purple (Glowing)
    { color: '#D946EF', value: 5 },               // Top Pink
    { color: '#22C55E', value: 15 },              // Green
    { color: '#3B82F6', value: 15 },              // Cyan/Blue
    { color: '#D946EF', value: 18 },              // Bottom Pink/Purple
    { color: '#6366F1', value: 17 },              // Bottom Blue
  ];

  // Calculate total value to determine percentages
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Gap size between segments (in degrees) - slightly reduced for better rounded appearance
  const gapSize = 15; 

  let currentAngle = -90; // Start at the top (12 o'clock)

  return (
    <div style={styles.container}>
      {/* Container for Chart and Text */}
      <div style={{ position: 'relative', width: size, height: size }}>
        
        {/* SVG Chart */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Define Glow Filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {data.map((item, index) => {
            // Calculate segment length
            const segmentAngle = (item.value / total) * 360;
            const filledAngle = segmentAngle - gapSize;
            
            // Calculate stroke dasharray (visible part, empty part)
            const strokeDasharray = `${(filledAngle / 360) * circumference} ${circumference}`;
            
            // Calculate rotation for this specific segment
            // We adjust by gapSize/2 to center the segment in its allocated slot
            const rotation = currentAngle + (gapSize / 3);
            
            // Update start position for next segment
            currentAngle += segmentAngle;

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeLinecap="round" // Slightly rounded ends
                transform={`rotate(${rotation} ${center} ${center})`}
                filter={item.glow ? 'url(#glow)' : undefined}
                style={{
                  transition: 'all 0.5s ease-out', // Smooth animation on load
                  opacity: 0.9 // Slight transparency for blending like the image
                }}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        {/* <div style={styles.centerTextContainer}>
          <span style={styles.label}>Portfolio Value</span>
          <h1 style={styles.value}>$0.00</h1>
        </div> */}
      </div>
    </div>
  );
};



export default DonutChart;