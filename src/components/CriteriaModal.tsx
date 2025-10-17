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
  onSave: () => void;
}

export const CriteriaModal: React.FC<CriteriaModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { criteriaWeights, setCriteriaWeights, targetDuration, setTargetDuration } = useComparison();
  const { user } = useAuth();

  const [weights, setWeights] = useState<CriteriaWeights>(criteriaWeights);
  const [useTarget, setUseTarget] = useState<boolean>(targetDuration != null);
  const [localTarget, setLocalTarget] = useState<number>(targetDuration ?? 120);

  useEffect(() => {
    if (isOpen) {
      setWeights(criteriaWeights);
      setUseTarget(targetDuration != null);
      setLocalTarget(targetDuration ?? 120);
    }
  }, [isOpen, criteriaWeights, targetDuration]);

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const handleWeightChange = (criterion: keyof CriteriaWeights, value: number) => {
    setWeights(prev => ({ ...prev, [criterion]: value }));
  };

  const handleReset = () => {
    const defaults = user?.defaultCriteriaWeights || defaultCriteriaWeights;
    setWeights(defaults);
    if (user?.defaultTargetDuration != null) {
      setUseTarget(true);
      setLocalTarget(user.defaultTargetDuration);
    } else {
      setUseTarget(false);
    }
  };

  const handleSave = () => {
    const normalizedWeights: CriteriaWeights = {
      rating: Math.round((weights.rating / totalWeight) * 100),
      duration: Math.round((weights.duration / totalWeight) * 100),
      genre: Math.round((weights.genre / totalWeight) * 100),
      director: Math.round((weights.director / totalWeight) * 100),
      cast: Math.round((weights.cast / totalWeight) * 100),
    };

    const weightSum = Object.values(normalizedWeights).reduce((sum, w) => sum + w, 0);
    if (weightSum !== 100) {
      normalizedWeights.rating += (100 - weightSum);
    }

    setCriteriaWeights(normalizedWeights);
    setTargetDuration(useTarget ? localTarget : undefined);
    onSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurar Criterios de Comparación" size="lg">
      <div className="space-y-6">
        <div className="bg-primary-50 dark:bg-slate-800 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-slate-300">
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

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Total de pesos:</span>
          <span className={`text-lg font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-primary-600 dark:text-primary-400'}`}>
            {totalWeight}%
          </span>
        </div>

        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-800 dark:text-slate-100">Usar duración objetivo</label>
            <input type="checkbox" checked={useTarget} onChange={(e) => setUseTarget(e.target.checked)} />
          </div>

          {useTarget && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-1">Duración objetivo (min)</label>
                <input
                  type="number"
                  min={60}
                  max={240}
                  step={5}
                  value={localTarget}
                  onChange={(e) => setLocalTarget(Math.max(0, Number(e.target.value)))}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <Slider
                  label={`Objetivo: ${localTarget} min`}
                  value={localTarget}
                  onChange={setLocalTarget}
                  min={60}
                  max={240}
                  description="Las películas cercanas a este valor puntuarán más alto en Duración"
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Nota: si la duración objetivo está desactivada, se usará el método anterior (más corta = mejor).
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer por Defecto</span>
          </Button>
          <div className="flex gap-3 ml-auto">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
