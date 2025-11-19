/**
 * Domain Entity representing a conventional commit message
 * Contains business logic and invariants
 */

import { CommitType } from '../value-objects/CommitType.js';
import { Scope } from '../value-objects/Scope.js';
import { CommitSubject } from '../value-objects/CommitSubject.js';

export interface CommitMessageProps {
  type: CommitType;
  subject: CommitSubject;
  scope?: Scope;
  body?: string;
  breaking?: boolean;
  breakingChangeDescription?: string;
}

export class CommitMessage {
  private readonly type: CommitType;
  private readonly subject: CommitSubject;
  private readonly scope: Scope;
  private readonly body?: string;
  private readonly breaking: boolean;
  private readonly breakingChangeDescription?: string;

  private constructor(props: CommitMessageProps) {
    this.type = props.type;
    this.subject = props.subject;
    this.scope = props.scope ?? Scope.empty();
    this.body = props.body?.trim();
    this.breaking = props.breaking ?? false;
    this.breakingChangeDescription = props.breakingChangeDescription?.trim();

    // Validate invariants
    this.validate();

    Object.freeze(this);
  }

  /**
   * Creates a new CommitMessage
   * @throws Error if invariants are violated
   */
  static create(props: CommitMessageProps): CommitMessage {
    return new CommitMessage(props);
  }

  /**
   * Validates business rules and invariants
   */
  private validate(): void {
    // If breaking change, description is recommended
    if (this.breaking && !this.breakingChangeDescription) {
      // This is a warning-level validation, not an error
      // Breaking changes should have descriptions, but it's not strictly required
    }

    // Body should not be too short if provided
    if (this.body && this.body.length > 0 && this.body.length < 10) {
      throw new Error(
        'Commit body too short. Should be at least 10 characters or omitted.'
      );
    }
  }

  /**
   * Formats the commit message as a conventional commit string
   */
  format(): string {
    let message = this.type.toString();

    if (!this.scope.isEmpty()) {
      message += `(${this.scope.toString()})`;
    }

    if (this.breaking) {
      message += '!';
    }

    message += `: ${this.subject.toString()}`;

    if (this.body) {
      message += `\n\n${this.body}`;
    }

    if (this.breaking && this.breakingChangeDescription) {
      message += `\n\nBREAKING CHANGE: ${this.breakingChangeDescription}`;
    }

    return message;
  }

  /**
   * Gets the commit type
   */
  getType(): CommitType {
    return this.type;
  }

  /**
   * Gets the commit subject
   */
  getSubject(): CommitSubject {
    return this.subject;
  }

  /**
   * Gets the commit scope
   */
  getScope(): Scope {
    return this.scope;
  }

  /**
   * Gets the commit body
   */
  getBody(): string | undefined {
    return this.body;
  }

  /**
   * Checks if this is a breaking change
   */
  isBreaking(): boolean {
    return this.breaking;
  }

  /**
   * Gets the breaking change description
   */
  getBreakingChangeDescription(): string | undefined {
    return this.breakingChangeDescription;
  }

  /**
   * Checks if this commit message equals another
   */
  equals(other: CommitMessage): boolean {
    return this.format() === other.format();
  }

  /**
   * Returns the formatted commit message
   */
  toString(): string {
    return this.format();
  }
}
