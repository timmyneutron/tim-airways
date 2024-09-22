import { useEffect, useState } from 'react';
import { Airport } from './types';
import { nameSearch, iataSearch } from './api';
import { useDebouncedCallback } from 'use-debounce';

export function useAirportOptions(search: string) {
    const [airportOptions, setAirportOptions] = useState<Array<Airport>>([]);

    function fetchAirportOptions() {
      if (search === "") {
        setAirportOptions([]);
        return;
      }
  
      const searches: Array<Promise<Response>> = [nameSearch(search)];
  
      const iataCodeRegex: RegExp = /^[a-zA-Z]{3}$/;
  
      if (iataCodeRegex.test(search)) {
        searches.push(iataSearch(search));
      }
  
      Promise.all(searches).then((responses) => {
        if (responses.length === 1) {
          responses[0].json().then(options => {
            setAirportOptions(options);
          });
        }
        if (responses.length === 2) {
          Promise.all([responses[0].json(), responses[1].json()]).then(data => {
            const options: Array<Airport> = data[1].length === 0 ? data[0] : data[1];
            setAirportOptions(options);
          });
        }
      });
    };
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(useDebouncedCallback(fetchAirportOptions, 200), [search]);
  
    return airportOptions;
  };

export function useInputWidth() {
    const [width, setWidth] = useState<number>(window.innerWidth < 500 ? 300 : 400);

    useEffect(() => {
        function handleResize() {
          setWidth(window.innerWidth < 500 ? 300 : 400);
        }
    
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return width;
}