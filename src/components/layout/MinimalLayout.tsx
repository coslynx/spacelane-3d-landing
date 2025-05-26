import React from 'react';

interface MinimalLayoutProps {
  children: React.ReactNode;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children }) => {
  // If there are no child elements, then we should short circuit.
  if (!children) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error, no children to load. 
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {children}
    </div>
  );
};

export default MinimalLayout;