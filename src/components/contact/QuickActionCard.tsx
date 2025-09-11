export interface QuickActionCardProps {
  id: string;
  title: string;
  description: string;
  colorTheme: 'red' | 'blue' | 'green';
  onClick?: () => void;
}

const QuickActionCard = ({
  title,
  description,
  colorTheme,
  onClick,
}: QuickActionCardProps) => {
  // Color mappings for different themes
  const colorClasses = {
    red: {
      background: 'bg-red-50',
      border: 'border-red-200',
      title: 'text-red-800',
      description: 'text-red-700',
    },
    blue: {
      background: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-800',
      description: 'text-blue-700',
    },
    green: {
      background: 'bg-green-50',
      border: 'border-green-200',
      title: 'text-green-800',
      description: 'text-green-700',
    },
  };

  const colors = colorClasses[colorTheme];

  return (
    <div
      className={`p-3 ${colors.background} border ${colors.border} rounded-lg ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      }`}
      onClick={onClick}
    >
      <h4 className={`font-medium ${colors.title} mb-1`}>{title}</h4>
      <p className={`text-sm ${colors.description}`}>{description}</p>
    </div>
  );
};

export default QuickActionCard;
