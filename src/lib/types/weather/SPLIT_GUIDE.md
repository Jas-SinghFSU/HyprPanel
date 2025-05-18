# Weather Types Split Guide

The weather types file is currently 1053 lines and contains all weather-related types.
This needs to be split into logical groups.

## Current Structure Analysis

The file likely contains:
1. API response types
2. UI display types  
3. Default values/constants
4. Weather service types
5. Icon mappings

## Proposed Split

```
src/lib/types/weather/
├── api/
│   ├── openweather.types.ts    # OpenWeatherMap API types
│   ├── responses.types.ts      # Generic API response types
│   └── index.ts
├── display/
│   ├── current.types.ts        # Current weather display
│   ├── forecast.types.ts       # Forecast display
│   ├── hourly.types.ts         # Hourly display
│   └── index.ts
├── defaults/
│   ├── weather.defaults.ts     # Default weather values
│   └── index.ts
├── service/
│   ├── weatherapi.types.ts     # Weather service types
│   └── index.ts
├── constants/
│   ├── units.ts               # Temperature units, etc.
│   ├── icons.ts               # Icon mappings
│   └── index.ts
└── index.ts                   # Re-export everything
```

## Migration Steps

1. **Analyze current file structure**
   ```bash
   # Count interface/type definitions
   grep -c "interface\|type" weather.types.ts
   ```

2. **Create new directory structure**
   ```bash
   mkdir -p src/lib/types/weather/{api,display,defaults,service,constants}
   ```

3. **Split types by category**
   - Move API-related types to `api/`
   - Move UI display types to `display/`
   - Move default values to `defaults/`
   - Move service types to `service/`
   - Move constants to `constants/`

4. **Create index files that re-export**
   ```typescript
   // src/lib/types/weather/index.ts
   export * from './api';
   export * from './display';
   export * from './defaults';
   export * from './service';
   export * from './constants';
   ```

5. **Update imports across codebase**
   - Find all imports of weather.types.ts
   - Update to use new modular imports

6. **Test and verify**
   - Ensure all types are accessible
   - Check that nothing breaks

## Important Notes

- Maintain all existing type names
- Don't change any type structures
- Keep backward compatibility
- Document any breaking changes