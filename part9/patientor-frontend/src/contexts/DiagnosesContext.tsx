import { createContext, useContext, useEffect, useState } from 'react'
import type { Diagnosis } from '../types'
import * as diagnoseService from '../services/diagnoses'
type DiagnosesMap = Record<string, Diagnosis>

const DiagnosesContext = createContext<DiagnosesMap>({});

export const DiagnosesProvider = ({ children }: { children: React.ReactNode }) => {
  const [map, setMap] = useState<DiagnosesMap>({});

  useEffect(() => {
    (async () => {
      const list = await diagnoseService.getAll();
      const m: DiagnosesMap = {};
      list.forEach(d => { m[d.code] = d; });
      setMap(m);
    })();
  }, []);

  return (
    <DiagnosesContext.Provider value={map}>{children}</DiagnosesContext.Provider>
  );
};

export const useDiagnoses = () => useContext(DiagnosesContext);