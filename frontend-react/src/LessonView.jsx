export default function LessonView({ lesson }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>{lesson.temat}</h2>
      <p>Poziom: {lesson.poziom}</p>

      <h3>Słówka</h3>
      <ul>
        {lesson.slowka.map((s, i) => (
          <li key={i}>
            <strong>{s.es}</strong> – {s.pl}
          </li>
        ))}
      </ul>
    </div>
  );
}
