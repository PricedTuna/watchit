import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Modal } from './Modal';
import { Slider } from './Slider';
import { Button } from './Button';
import { useComparison } from '../context/ComparisonContext';
import { useAuth } from '../context/AuthContext';
import { defaultCriteriaWeights } from '../data/users';
import { CriteriaWeights } from '../types';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CriteriaModal: React.FC<CriteriaModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { criteriaWeights, setCriteriaWeights } = useComparison();
  const { user } = useAuth();

  const [weights, setWeights] = useState<CriteriaWeights>(criteriaWeights);

  useEffect(() => {
    if (isOpen) {
      setWeights(criteriaWeights);
    }
  }, [isOpen, criteriaWeights]);

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const handleWeightChange = (criterion: keyof CriteriaWeights, value: number) => {
    setWeights(prev => ({ ...prev, [criterion]: value }));
  };

  const handleReset = () => {
    const defaults = user?.defaultCriteriaWeights || defaultCriteriaWeights;
    setWeights(defaults);
  };

  const handleSave = () => {
    const normalizedWeights: CriteriaWeights = {
      rating: Math.round((weights.rating / totalWeight) * 100),
      duration: Math.round((weights.duration / totalWeight) * 100),
      genre: Math.round((weights.genre / totalWeight) * 100),
      director: Math.round((weights.director / totalWeight) * 100),
      cast: Math.round((weights.cast / totalWeight) * 100),
    };

    const total = Object.values(normalizedWeights).reduce((sum, w) => sum + w, 0);
    if (total !== 100) {
      normalizedWeights.rating += (100 - total);
    }

    setCriteriaWeights(normalizedWeights);
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurar Criterios de Comparación" size="lg">
      <div className="space-y-6">
        <div className="bg-sky-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Ajusta la importancia de cada criterio según tus preferencias. Los pesos se normalizarán automáticamente.
          </p>
        </div>

        <div className="space-y-6">
          <Slider
            label="Calificación"
            value={weights.rating}
            onChange={(value) => handleWeightChange('rating', value)}
            description="Importancia de la calificación general de la película"
          />

          <Slider
            label="Duración"
            value={weights.duration}
            onChange={(value) => handleWeightChange('duration', value)}
            description="Preferencia por películas más cortas o más largas"
          />

          <Slider
            label="Género"
            value={weights.genre}
            onChange={(value) => handleWeightChange('genre', value)}
            description="Coincidencia con tus géneros favoritos"
          />

          <Slider
            label="Director"
            value={weights.director}
            onChange={(value) => handleWeightChange('director', value)}
            description="Importancia del director de la película"
          />

          <Slider
            label="Reparto"
            value={weights.cast}
            onChange={(value) => handleWeightChange('cast', value)}
            description="Importancia de los actores principales"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Total de pesos:</span>
          <span className={`text-lg font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-sky-600'}`}>
            {totalWeight}%
          </span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer por Defecto</span>
          </Button>
          <Button onClick={handleSave} fullWidth>
            Guardar y Comparar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
