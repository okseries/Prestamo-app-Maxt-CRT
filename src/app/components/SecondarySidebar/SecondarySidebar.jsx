import useSettings from 'app/hooks/useSettings';
import SecondarySidenavTheme from '../MatxTheme/SecondarySidenavTheme/SecondarySidenavTheme';
import SecondarySidebarContent from './SecondarySidebarContent';
import SecondarySidebarToggle from './SecondarySidebarToggle';

const SecondarySidebar = () => {
  const { settings } = useSettings();
  const secondarySidebarTheme = settings.themes[settings.secondarySidebar.theme];

  return (
    <SecondarySidenavTheme theme={secondarySidebarTheme}>
      {settings.secondarySidebar.open && <SecondarySidebarContent />}
      {/*<SecondarySidebarToggle />*/}{' '}
      {/*aqui esta el menu que aparecia abajo como de ajuste y eso*/}
    </SecondarySidenavTheme>
  );
};

export default SecondarySidebar;
