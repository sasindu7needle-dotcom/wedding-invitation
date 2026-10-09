export default function GuestGreeting({ name }) {
    return (
        <div className="guest-greeting">
            <p className="eyebrow">Especially for</p>
            <p className="guest-name">{name}</p>
        </div>
    );
}
