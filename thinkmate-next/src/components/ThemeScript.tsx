/**
 * ThemeScript Component
 * Inline script that loads theme preference before page renders
 * Prevents flash of wrong theme (FOUC)
 */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var darkMode = localStorage.getItem('darkMode');
              if (darkMode === 'enabled') {
                document.documentElement.classList.add('dark');
              } else if (darkMode === 'disabled') {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}
