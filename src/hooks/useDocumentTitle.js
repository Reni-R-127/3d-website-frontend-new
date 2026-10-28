import { useEffect } from 'react';
export default function useDocumentTitle(title){useEffect(()=>{document.title=title+' | ProJenius 3D Printing'},[title])}
