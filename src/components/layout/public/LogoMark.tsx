export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 36 36"
            className={className}
            role="img"
            aria-labelledby="gridguard-logo-title"
        >
            <title id="gridguard-logo-title">GridGuard logo</title>
            <path
                d="M18 2.5 31.5 7.8v9.4c0 8.1-5.6 13.9-13.5 16.3C10.1 31.1 4.5 25.3 4.5 17.2V7.8L18 2.5Z"
                className="fill-primary"
            />
            <path
                d="M19.8 9.5 12.5 19.2h4.7l-1 7.3 7.3-9.7h-4.7l1-7.3Z"
                className="fill-primary-foreground"
            />
        </svg>
    )
}