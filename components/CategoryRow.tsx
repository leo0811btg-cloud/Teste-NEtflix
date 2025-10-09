
import React from 'react';

interface CategoryRowProps {
  title: string;
  children: React.ReactNode;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ title, children }) => {
  return (
    <section className="pl-4 md:pl-16">
      <h3 className="text-2xl md:text-3xl font-bebas mb-4 tracking-wide">{title}</h3>
      <div className="flex overflow-x-auto pb-4 -mb-4 scrollbar-hide">
        {children}
      </div>
    </section>
  );
};
