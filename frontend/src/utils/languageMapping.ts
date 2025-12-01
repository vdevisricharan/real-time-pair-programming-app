export const getMonacoLanguage = (lang: string): string => {
  const languageMap: { [key: string]: string } = {
    'python': 'python',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'java': 'java',
  };
  return languageMap[lang] || 'plaintext';
};

export const getFileExtension = (language: string): string => {
  const extensionMap: { [key: string]: string } = {
    'python': 'py',
    'javascript': 'js',
    'typescript': 'ts',
    'java': 'java',
  };
  return extensionMap[language] || 'txt';
};