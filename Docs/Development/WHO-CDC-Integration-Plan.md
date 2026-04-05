# WHO + CDC Data Integration Plan for Sprout-App

## Problem Statement

The Sprout-App currently has basic growth tracking (weight, height, head circumference recording) but lacks the critical clinical credibility feature: **real WHO + CDC growth percentile data integration**. This is essential for:

1. **Building Trust** - Parents need clinically accurate benchmarks, not generic estimates
2. **Reducing Anxiety** - Showing where their baby sits on official WHO/CDC growth curves
3. **Early Detection** - Identifying concerning growth patterns (drops across percentile lines)
4. **Differentiation** - Most competitors use fake/estimated data

## Proposed Approach

### Data Strategy

**Embedded Dataset Approach (Recommended)**
- Use official WHO/CDC growth chart datasets as embedded JSON files
- Benefits: Fast, offline-first, no API rate limits, no dependencies
- Drawbacks: Needs periodic manual updates (rare - standards change infrequently)

**API Approach (Alternative)**
- Real-time API calls to CDC/WHO endpoints (if available)
- Benefits: Always current
- Drawbacks: Network dependency, rate limits, latency, no official free APIs

**Recommendation: Hybrid**
- Embed WHO/CDC standard datasets (LMS parameters for percentile calculations)
- Optional: Future API integration for supplementary data (vaccines, outbreak alerts)

### Data Sources

1. **WHO Child Growth Standards (0-5 years)**
   - Source: https://www.who.int/tools/child-growth-standards
   - Datasets: Weight-for-age, length/height-for-age, weight-for-length, head circumference-for-age, BMI-for-age
   - Format: LMS parameters (Lambda, Mu, Sigma) for percentile calculation
   - Coverage: Both sexes, 0-60 months

2. **CDC Growth Charts (2-20 years)**
   - Source: https://www.cdc.gov/growthcharts/
   - Datasets: Similar metrics extended to age 20
   - Format: LMS parameters
   - Coverage: Both sexes, 2-20 years

3. **Premature Baby Adjustments**
   - Fenton Preterm Growth Charts for babies born <37 weeks
   - WHO standards with age correction

## Implementation Plan

### Phase 1: Data Foundation

**1.1 Download & Process WHO/CDC Datasets**
- Download LMS parameter tables from WHO/CDC official sources
- Convert to TypeScript-friendly JSON format
- Organize by metric type (weight, height, head circumference) and sex
- Store in `/src/core/data/growthStandards/`

**1.2 Create Data Models**
- Define TypeScript interfaces for growth standards
- Create percentile calculation utility functions
- Implement LMS method for percentile computation

**1.3 Build Health Data Service**
- Create `/src/core/api/healthDataService.ts`
- Implement functions to query embedded datasets
- Add caching layer for performance

### Phase 2: Percentile Calculation Engine

**2.1 Growth Analysis Utilities**
- Build `/src/shared/utils/growthCalculations.ts`
- Implement percentile calculation from LMS parameters
- Add z-score conversion functions
- Handle age adjustment for premature babies

**2.2 Alert Detection System**
- Identify when baby crosses 2+ percentile lines (red flag)
- Detect plateau or drop in growth velocity
- Flag measurements outside 3rd-97th percentile range

**2.3 Data Enrichment**
- Enhance existing `GrowthEntry` model with calculated percentiles
- Store percentile values with each growth measurement
- Track historical percentile changes

### Phase 3: Growth Feature Implementation

**3.1 Extend Data Models**
- Update `GrowthEntry` type with percentile fields
- Create `GrowthAnalysis` type for computed metrics
- Add `GrowthAlert` type for flagged concerns

**3.2 Growth Store Enhancement**
- Extend `useBabyStore` with growth analysis functions
- Add methods to calculate percentiles for all entries
- Implement alert detection logic

**3.3 Growth Visualization**
- Install chart library (`react-native-svg` + `victory-native`)
- Create `GrowthChart` component
- Display WHO/CDC percentile curves (3rd, 15th, 50th, 85th, 97th)
- Plot baby's measurements on curves
- Add interactive features (zoom, pan, tooltips)

### Phase 4: UI/UX Implementation

**4.1 Growth Screen**
- Build `/src/features/growth/screens/GrowthScreen.tsx`
- Tabs for different metrics (weight, height, head circumference)
- Chart visualization with percentile overlay
- List view of all entries with calculated percentiles

**4.2 Growth Entry Enhancement**
- Update measurement input screen to show real-time percentile
- Display percentile immediately after entering values
- Show visual indicator (color-coded: green=normal, yellow=borderline, red=concern)

**4.3 Alert System UI**
- Create alert banner for concerning growth patterns
- Display actionable guidance ("Consider discussing with pediatrician")
- Add "Learn More" explanations about percentiles

**4.4 PDF Export**
- Install PDF generation library (`react-native-pdf` or `expo-print`)
- Create formatted growth report template
- Include: Baby info, growth chart images, measurement table, percentile history
- Add "Share with Doctor" functionality

### Phase 5: Advanced Features

**5.1 Milestone Integration**
- Download WHO developmental milestone data
- Create milestone tracking feature linked to growth
- Alert if growth issues correlate with milestone delays

**5.2 Country-Specific Adaptations**
- Support multiple growth standards (UK, Australia, etc.)
- User preference for WHO vs CDC charts
- Metric vs Imperial unit conversion

**5.3 Firebase Sync**
- Sync growth data and calculated percentiles to Firestore
- Enable multi-device access
- Backup and restore functionality

**5.4 Notifications**
- Reminder to log weekly/monthly measurements
- Alert notifications for concerning growth patterns
- Milestone achievement celebrations

### Phase 6: Testing & Validation

**6.1 Data Accuracy Testing**
- Unit tests for percentile calculations
- Validate against WHO/CDC published examples
- Test edge cases (premature, outliers, boundary ages)

**6.2 User Testing**
- Beta test with real parents
- Validate anxiety reduction vs increased concern
- A/B test alert phrasing to minimize panic

**6.3 Performance Optimization**
- Benchmark chart rendering performance
- Optimize dataset loading (lazy load by age range)
- Cache calculated percentiles

## Technical Dependencies

### New Packages to Install
```json
{
  "react-native-svg": "^15.0.0",           // SVG rendering for charts
  "victory-native": "^37.0.0",             // Chart library
  "expo-file-system": "^19.0.0",           // File handling for datasets
  "date-fns": "^3.0.0"                     // Date manipulation
}
```

### Optional (for PDF export)
```json
{
  "expo-print": "^14.0.0",                 // Print to PDF
  "expo-sharing": "^14.0.0"                // Share PDF files
}
```

## File Structure

```
/src
├── /core
│   ├── /data
│   │   └── /growthStandards              # NEW: Embedded WHO/CDC data
│   │       ├── who-weight-for-age-boys.json
│   │       ├── who-weight-for-age-girls.json
│   │       ├── who-length-for-age-boys.json
│   │       ├── who-length-for-age-girls.json
│   │       ├── cdc-weight-for-age-boys.json
│   │       └── ... (all standard datasets)
│   ├── /api
│   │   └── healthDataService.ts           # NEW: Data query service
│   └── /constants
│       └── growthStandards.ts             # NEW: Constants
├── /shared
│   ├── /utils
│   │   ├── growthCalculations.ts          # NEW: Percentile math
│   │   ├── ageCalculations.ts             # Enhanced age utils
│   │   └── alertDetection.ts              # NEW: Alert logic
│   ├── /hooks
│   │   ├── useGrowthAnalysis.ts           # NEW: Growth analysis hook
│   │   └── usePercentileCalculation.ts    # NEW: Percentile hook
│   └── /components
│       └── /charts
│           ├── GrowthChart.tsx            # NEW: Main chart component
│           ├── PercentileCurve.tsx        # NEW: Curve overlay
│           └── DataPoint.tsx              # NEW: Plot point
├── /features
│   └── /growth
│       ├── /store
│       │   └── growthStore.ts             # Enhanced with percentiles
│       ├── /screens
│       │   ├── GrowthScreen.tsx           # NEW: Main screen
│       │   └── GrowthDetailScreen.tsx     # NEW: Metric detail view
│       ├── /components
│       │   ├── GrowthMetricCard.tsx       # NEW: Metric summary card
│       │   ├── GrowthAlertBanner.tsx      # NEW: Alert UI
│       │   └── PercentileIndicator.tsx    # NEW: Visual percentile badge
│       └── /types
│           └── growth.types.ts            # NEW: Type definitions
```

## Data Model Enhancements

### GrowthEntry (Enhanced)
```typescript
interface GrowthEntry {
  // Existing fields
  id: string
  babyId: string
  date: string
  weightKg: number | null
  heightCm: number | null
  headCircumferenceCm: number | null
  notes?: string
  
  // NEW: Calculated percentiles
  weightPercentile?: number
  heightPercentile?: number
  headCircumferencePercentile?: number
  
  // NEW: Z-scores
  weightZScore?: number
  heightZScore?: number
  headCircumferenceZScore?: number
  
  // NEW: Age at measurement
  ageInDays: number
  adjustedAgeInDays?: number // For premature babies
  
  // Metadata
  createdAt: string
  updatedAt: string
}
```

### GrowthAlert (New)
```typescript
interface GrowthAlert {
  id: string
  babyId: string
  type: 'percentile_drop' | 'percentile_outlier' | 'growth_plateau'
  severity: 'info' | 'warning' | 'urgent'
  metric: 'weight' | 'height' | 'headCircumference'
  message: string
  detectedAt: string
  dismissed: boolean
  dismissedAt?: string
}
```

### GrowthStandard (New)
```typescript
interface GrowthStandard {
  ageInDays: number
  L: number  // Lambda (skewness)
  M: number  // Mu (median)
  S: number  // Sigma (coefficient of variation)
}

interface GrowthStandardSet {
  metric: 'weight' | 'length' | 'height' | 'headCircumference' | 'bmi'
  sex: 'male' | 'female'
  standard: 'WHO' | 'CDC'
  ageRangeMin: number // days
  ageRangeMax: number // days
  unit: 'kg' | 'cm'
  data: GrowthStandard[]
}
```

## Key Algorithms

### Percentile Calculation (LMS Method)
```typescript
/**
 * Calculate percentile using WHO/CDC LMS parameters
 * Formula: Percentile = Φ(Z) where Z = [(X/M)^L - 1] / (L * S)
 * Φ = cumulative distribution function of standard normal
 */
function calculatePercentile(
  measurement: number,
  ageInDays: number,
  sex: 'male' | 'female',
  metric: 'weight' | 'height' | 'headCircumference'
): number
```

### Alert Detection
```typescript
/**
 * Detect concerning growth patterns
 * Rules:
 * 1. Drop > 2 percentile lines (e.g., 75th → 25th)
 * 2. Measurement < 3rd percentile or > 97th percentile
 * 3. No growth over 3+ consecutive measurements
 */
function detectGrowthAlerts(
  entries: GrowthEntry[],
  baby: Baby
): GrowthAlert[]
```

## Considerations

### Privacy & Compliance
- No health data sent to 3rd parties
- All calculations done locally
- HIPAA-like data handling (even if not regulated)
- Clear disclaimers: "Not a replacement for medical advice"

### Clinical Accuracy
- Use official WHO/CDC datasets only (no approximations)
- Clear labeling of data sources
- Version tracking for growth standards
- Disclaimer on limitations (individual variation)

### User Experience
- Color-coded percentile indicators (avoid alarming language)
- Educational content on "What percentiles mean"
- Positive framing when within normal range
- Gentle alerts for concerning patterns (not diagnostic)

### Performance
- Lazy load growth standards (only load needed sex/metric)
- Cache calculated percentiles
- Optimize chart rendering for smooth interactions
- Support offline mode (all data embedded)

## Success Metrics

1. **Accuracy**: 100% match with WHO/CDC published percentile examples
2. **Performance**: Chart renders in < 500ms
3. **Adoption**: 80%+ of users view growth charts within first week
4. **Engagement**: 50%+ users log growth measurements monthly
5. **Trust**: User feedback indicates increased confidence vs anxiety

## Timeline Estimate

- **Phase 1 (Data Foundation)**: 1-2 days
- **Phase 2 (Calculation Engine)**: 2-3 days
- **Phase 3 (Growth Feature)**: 3-4 days
- **Phase 4 (UI/UX)**: 4-5 days
- **Phase 5 (Advanced Features)**: 3-5 days
- **Phase 6 (Testing)**: 2-3 days

**Total**: 15-22 days of development

## Next Steps

1. Review and approve this plan
2. Download WHO/CDC official datasets
3. Begin Phase 1 implementation
4. Set up testing environment with known-good examples
5. Create feature branch: `feature/who-cdc-integration`

---

**Note**: This plan prioritizes clinical accuracy and parental peace-of-mind over feature bloat. The embedded dataset approach ensures offline-first functionality, which is critical for hospital/low-signal use cases mentioned in the product vision.
