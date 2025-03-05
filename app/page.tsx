import getAndSaveData from '@/services/entrez';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  //getAndSaveData();
  return (
    <>
      <Welcome />
    </>
  );
}
