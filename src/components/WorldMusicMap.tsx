
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Country codes and names mapping with regions
const countries = [
  { code: 'US', name: 'United States', region: 'North America' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'JP', name: 'Japan', region: 'Asia' },
  { code: 'BR', name: 'Brazil', region: 'South America' },
  { code: 'AU', name: 'Australia', region: 'Oceania' },
  { code: 'CA', name: 'Canada', region: 'North America' },
  { code: 'MX', name: 'Mexico', region: 'North America' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
  { code: 'RU', name: 'Russia', region: 'Europe/Asia' },
  { code: 'IN', name: 'India', region: 'Asia' },
  { code: 'KR', name: 'South Korea', region: 'Asia' },
  { code: 'ZA', name: 'South Africa', region: 'Africa' }
];

// Group countries by region
const groupedCountries = countries.reduce((acc, country) => {
  if (!acc[country.region]) {
    acc[country.region] = [];
  }
  acc[country.region].push(country);
  return acc;
}, {} as Record<string, typeof countries>);

// Sort regions
const regions = Object.keys(groupedCountries).sort();

interface WorldMusicMapProps {
  className?: string;
}

const WorldMusicMap = ({ className }: WorldMusicMapProps) => {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Explore Music Around the World</h2>
      <div className="space-y-8">
        {regions.map((region) => (
          <div key={region} className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="bg-black/5 px-6 py-4">
              <h3 className="font-semibold text-lg">{region}</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Explore</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedCountries[region].sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                  <TableRow key={country.code}>
                    <TableCell className="font-medium">{country.name}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/countries/${country.code}`}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors"
                      >
                        View Charts
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldMusicMap;
