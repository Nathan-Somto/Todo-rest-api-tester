export default function TestResults({ results }) {
  return (
    <div className="test__results">
      {results.map(({ title, passed, description }, index) => (
        <>
          <p key={`${title}-${index}-${passed}`}>
            {title}:{" "}
            <span className={`${passed ? "passed" : "failed"}`}>
              {passed ? "Passed" : "Failed"}
            </span>
          </p>
          <p>
            Description: <span>{description} </span>
          </p>
        </>
      ))}
    </div>
  );
}
