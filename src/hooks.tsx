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
      
      // The api has two endpoints for searching by name and by IATA code
      // So we make an array of promises for both
      const searches: Array<Promise<Response>> = [nameSearch(search)];
  
      // Only search for IATA code if the search string is 3 letters
      const iataCodeRegex: RegExp = /^[a-zA-Z]{3}$/;
      if (iataCodeRegex.test(search)) {
        searches.push(iataSearch(search));
      }
  
      Promise.all(searches).then((responses) => {
        if (responses.length === 1) {
          if (responses[0].ok) {
            responses[0].json().then(options => {
              setAirportOptions(options);
            });
          }
          return;
        }

        if (responses.length === 2) {
          // If there are two responses, use the IATA code search
          // If the IATA code search returns no results, use the name search
          if (responses[0].ok && responses[1].ok) {
            Promise.all([responses[0].json(), responses[1].json()]).then(data => {
              const options: Array<Airport> = data[1].length === 0 ? data[0] : data[1];
              setAirportOptions(options);
            });
            return;
          }

          if (responses[0].ok) {
            responses[0].json().then(options => {
              setAirportOptions(options);
            });
          }

          if (responses[1].ok) {
            responses[1].json().then(options => {
              setAirportOptions(options);
            });
          }
        }
      });
    };
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(useDebouncedCallback(fetchAirportOptions, 100), [search]);
  
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