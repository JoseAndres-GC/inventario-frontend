type Props = {
  titulo: string;
  subtitulo: string;
};

export default function Hero({ titulo, subtitulo }: Props) {
  return (
    <section className="text-center py-10 bg-gray-800">
      <h2 className="text-3xl font-bold">{titulo}</h2>
      <p className="text-gray-300 mt-2">{subtitulo}</p>
    </section>
  );
}
