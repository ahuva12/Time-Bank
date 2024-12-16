import styles from './ExplanationPage.module.css';

const ExplanationPage: React.FC<{ explanation: string }> = ({ explanation }) => {
    return (
        <div className={styles.ExplanationPage}>{explanation}</div>
    )
}

export default ExplanationPage;