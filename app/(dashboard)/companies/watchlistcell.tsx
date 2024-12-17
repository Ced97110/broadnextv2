import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Watchlist from '../company/[NAME]/watchlist';
import { TableList } from '@/lib/data';
import { debounce } from 'lodash';
import { Company } from './data-table';

interface WatchlistProps {
  Id: number;
  isWatched: boolean;
  setLoading: (loading: boolean) => void;
  setLoadingCompanies: React.Dispatch<React.SetStateAction<number[]>>;
  setData: React.Dispatch<React.SetStateAction<Company[]>>;
  setError: (message: string) => void;
  handleWatchListFetch: (id: number) => Promise<void>;
  handleRemove: (id: number) => Promise<number>;
  notifyAdd: () => void;
  notifyRemove: () => void;
}

const WatchlistCell: React.FC<WatchlistProps> = ({
  Id,
  isWatched,
  setLoading,
  setLoadingCompanies,
  setData,
  setError,
  handleWatchListFetch,
  handleRemove,
  notifyAdd,
  notifyRemove,
}) => {
  const [value, setValue] = useState(isWatched);

  useEffect(() => {
    setValue(isWatched);
  }, [isWatched]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TableList();
      setData((prev) => [...prev, ...data]); // Corrigé ici
      console.log(data);
    } catch (err) {
      setError('Échec de la récupération des données.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setData, setError]);

  const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData]);

  const handleAddWatchlist = useCallback(async (id: number) => {
    setLoadingCompanies((prev) => [...prev, id]);
    setLoading(true);
    notifyAdd();

    try {
      await handleWatchListFetch(id);
      debouncedFetchData();
    } catch (err) {
      setError("Échec de l'ajout à la watchlist.");
      console.error(err);
    } finally {
      setLoadingCompanies((prev) => prev.filter((cid) => cid !== id));
      setLoading(false);
    }
  }, [debouncedFetchData, handleWatchListFetch, notifyAdd, setError, setLoading, setLoadingCompanies]);

  const handleRemoveFromWatchlist = useCallback(async (id: number) => {
    setLoading(true);
    setLoadingCompanies((prev) => [...prev, id]);
    notifyRemove();
    try {
      const status = await handleRemove(id);
      if (status === 200) {
        debouncedFetchData();
      }
    } catch (err) {
      setError('Échec de la suppression de la watchlist.');
      console.error(err);
    } finally {
      setLoadingCompanies((prev) => prev.filter((cid) => cid !== id));
      setLoading(false);
    }
  }, [debouncedFetchData, handleRemove, notifyRemove, setError, setLoading, setLoadingCompanies]);


  useEffect(() => {
    debouncedFetchData().cancel();
  }, [debouncedFetchData]);


  useEffect(() => {
    debouncedFetchData();
  }, [debouncedFetchData]);


  return (
    <Watchlist
      Id={Id}
      isWatched={isWatched}
      isLoading={false} // Ajuster selon votre logique
      loading={false} // Ajuster selon votre logique
      handleRemove={handleRemoveFromWatchlist}
      handleAddWatchlist={handleAddWatchlist}
    />
  );
};

export default WatchlistCell;