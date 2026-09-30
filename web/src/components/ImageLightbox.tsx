import { useRef } from "react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ImageLightbox({ src, alt, className }: ImageLightboxProps): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeOnBackdropClick(event: React.MouseEvent<HTMLDialogElement>): void {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" className="image-lightbox__trigger" aria-label={`Agrandir : ${alt}`} onClick={() => dialogRef.current?.showModal()}>
        <img className={className} src={src} alt={alt} />
      </button>
      <dialog ref={dialogRef} className="image-lightbox__dialog" aria-label={alt} onClick={closeOnBackdropClick}>
        <button type="button" className="image-lightbox__close" aria-label="Fermer l’image agrandie" onClick={() => dialogRef.current?.close()}>
          Fermer
        </button>
        <img className="image-lightbox__preview" src={src} alt={alt} />
      </dialog>
    </>
  );
}